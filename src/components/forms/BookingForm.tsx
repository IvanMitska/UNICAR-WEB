import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Check,
  ChevronRight,
  ChevronLeft,
  Package,
  Shield,
  Baby,
  Navigation,
  Users,
  Car,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useBookingStore } from '../../store/useBookingStore';
import { formatCurrency, getDailyRateForDuration, calculateRentalTotal } from '../../utils/formatters';
import { services } from '../../data/services';
import { offices } from '../../data/offices';
import { differenceInDays } from 'date-fns';
import { carsApi, CarsApiError } from '../../api/carsApi';
import i18n from '../../i18n';
import { pickLocalized } from '../../utils/localized';

const createCustomerSchema = (t: (k: string) => string) => z.object({
  firstName: z.string().min(2, t('bookingForm.validation.firstName')),
  lastName: z.string().min(2, t('bookingForm.validation.lastName')),
  email: z.string().email(t('bookingForm.validation.email')),
  phone: z.string().regex(/^\+7\d{10}$/, t('bookingForm.validation.phone')),
  birthDate: z.string().min(1, t('bookingForm.validation.birthDate')),
  licenseNumber: z.string().min(10, t('bookingForm.validation.licenseNumber')),
  licenseDate: z.string().min(1, t('bookingForm.validation.licenseDate')),
});

type CustomerFormData = z.infer<ReturnType<typeof createCustomerSchema>>;

const STEP_DEFS = [
  { id: 1, key: 'dates', icon: Calendar },
  { id: 2, key: 'services', icon: Package },
  { id: 3, key: 'customer', icon: User },
  { id: 4, key: 'confirmation', icon: Check },
] as const;

const serviceIcons: Record<string, React.ComponentType<any>> = {
  'child-seat': Baby,
  'gps': Navigation,
  'additional-driver': Users,
  'full-insurance': Shield,
  'delivery': Car,
};

function pluralizeDays(days: number, t: (k: string) => string): string {
  const lang = (i18n.language || 'ru').toLowerCase().split('-')[0];
  if (lang !== 'ru') {
    return days === 1 ? t('bookingForm.dayOne') : t('bookingForm.dayMany');
  }
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return t('bookingForm.dayOne');
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return t('bookingForm.dayFew');
  return t('bookingForm.dayMany');
}

export const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('pages');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const customerSchema = useMemo(() => createCustomerSchema(t), [t]);

  const {
    selectedCar,
    startDate,
    endDate,
    pickupLocation,
    returnLocation,
    setDates,
    setLocations,
    setCustomer,
  } = useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const [bookingDates, setBookingDates] = useState({
    start: startDate ? new Date(startDate).toISOString().split('T')[0] : '',
    end: endDate ? new Date(endDate).toISOString().split('T')[0] : '',
  });

  const [locations, setBookingLocations] = useState({
    pickup: pickupLocation || offices[0].id,
    return: returnLocation || offices[0].id,
  });

  const rentalDays = useMemo(() => {
    if (!bookingDates.start || !bookingDates.end) return 0;
    const days = differenceInDays(new Date(bookingDates.end), new Date(bookingDates.start));
    return Math.max(1, days);
  }, [bookingDates]);

  const dailyRate = useMemo(() => {
    if (!selectedCar || rentalDays === 0) return selectedCar?.pricePerDay || 0;
    return getDailyRateForDuration(selectedCar.pricePerDay, rentalDays);
  }, [selectedCar, rentalDays]);

  const calculateTotal = useMemo(() => {
    if (!selectedCar) return 0;

    const carPrice = calculateRentalTotal(selectedCar.pricePerDay, rentalDays);
    const servicesPrice = selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        return total + (service.pricePerDay ? service.pricePerDay * rentalDays : service.price);
      }
      return total;
    }, 0);

    return carPrice + servicesPrice;
  }, [selectedCar, rentalDays, selectedServices]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setDates(new Date(bookingDates.start), new Date(bookingDates.end));
      setLocations(locations.pickup, locations.return);
    }

    if (currentStep < STEP_DEFS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    if (!selectedCar) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const additionalServicesData = selectedServices.map(serviceId => {
        const service = services.find(s => s.id === serviceId);
        return {
          id: serviceId,
          name: service ? pickLocalized(service.name, 'en') : serviceId,
          price: service?.pricePerDay || service?.price || 0,
          perDay: !!service?.pricePerDay,
        };
      });

      const bookingData = {
        vehicleId: selectedCar.id,
        customerFirstName: data.firstName,
        customerLastName: data.lastName,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerBirthDate: data.birthDate,
        customerLicenseNumber: data.licenseNumber,
        customerLicenseIssueDate: data.licenseDate,
        startDate: bookingDates.start,
        endDate: bookingDates.end,
        pickupLocation: locations.pickup,
        returnLocation: locations.return,
        additionalServices: additionalServicesData,
        totalPrice: calculateTotal,
      };

      const response = await carsApi.createBooking(bookingData);

      setCustomer({
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.birthDate,
        driverLicense: data.licenseNumber,
      });

      navigate(`/booking/confirmation?ref=${response.referenceCode}`);
    } catch (error) {
      if (error instanceof CarsApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError(t('bookingForm.genericError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedCar) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t('bookingForm.noCarSelected')}</h3>
        <p className="text-gray-600 mb-4">{t('bookingForm.noCarSelectedHint')}</p>
        <Button onClick={() => navigate('/cars')}>
          {t('bookingForm.goToCatalog')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 overflow-hidden">
        <div className="flex items-center justify-between">
          {STEP_DEFS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="mt-2 text-xs md:text-sm font-medium text-gray-700 text-center hidden sm:block max-w-[80px] md:max-w-none">
                  {t(`bookingForm.steps.${step.key}`)}
                </span>
              </div>
              {index < STEP_DEFS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 sm:mx-2 md:mx-4 transition-colors ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCar.brand} {selectedCar.model}
          </h2>
          <p className="text-gray-600">
            {formatCurrency(dailyRate)}{t('bookingForm.perDay')}
            {dailyRate < selectedCar.pricePerDay && (
              <span className="ml-2 text-gray-400 line-through text-sm">
                {formatCurrency(selectedCar.pricePerDay)}
              </span>
            )}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('bookingForm.fields.startDate')}
                    </label>
                    <input
                      type="date"
                      value={bookingDates.start}
                      onChange={(e) => setBookingDates({ ...bookingDates, start: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('bookingForm.fields.endDate')}
                    </label>
                    <input
                      type="date"
                      value={bookingDates.end}
                      onChange={(e) => setBookingDates({ ...bookingDates, end: e.target.value })}
                      min={bookingDates.start}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {t('bookingForm.fields.pickupLocation')}
                    </label>
                    <select
                      value={locations.pickup}
                      onChange={(e) => setBookingLocations({ ...locations, pickup: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {offices.map(office => (
                        <option key={office.id} value={office.id}>
                          {pickLocalized(office.name, i18n.language)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {t('bookingForm.fields.returnLocation')}
                    </label>
                    <select
                      value={locations.return}
                      onChange={(e) => setBookingLocations({ ...locations, return: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {offices.map(office => (
                        <option key={office.id} value={office.id}>
                          {pickLocalized(office.name, i18n.language)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {rentalDays > 0 && (
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-primary-900">
                      {t('bookingForm.rentalPeriod')}: <strong>{rentalDays} {pluralizeDays(rentalDays, t)}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">{t('bookingForm.selectServices')}</h3>

                {services.map(service => {
                  const Icon = serviceIcons[service.id] || Package;
                  const isSelected = selectedServices.includes(service.id);

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Icon className={`w-6 h-6 mr-3 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                          <div>
                            <h4 className="font-semibold text-gray-900">{pickLocalized(service.name, i18n.language)}</h4>
                            <p className="text-sm text-gray-600 mt-1">{pickLocalized(service.description, i18n.language)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(service.pricePerDay ? service.pricePerDay : service.price)}
                            {service.pricePerDay && t('bookingForm.perDay')}
                          </p>
                          <div className={`w-5 h-5 rounded-full border-2 mt-2 ml-auto ${
                            isSelected
                              ? 'bg-primary-500 border-primary-500'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white m-auto" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentStep === 3 && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('bookingForm.fields.firstName')}
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.firstName && (
                      <p className="text-yellow-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('bookingForm.fields.lastName')}
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.lastName && (
                      <p className="text-yellow-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-1" />
                      {t('bookingForm.fields.email')}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.email && (
                      <p className="text-yellow-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-1" />
                      {t('bookingForm.fields.phone')}
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="+7XXXXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.phone && (
                      <p className="text-yellow-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('bookingForm.fields.birthDate')}
                    </label>
                    <input
                      {...register('birthDate')}
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.birthDate && (
                      <p className="text-yellow-500 text-sm mt-1">{errors.birthDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('bookingForm.fields.licenseNumber')}
                    </label>
                    <input
                      {...register('licenseNumber')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.licenseNumber && (
                      <p className="text-yellow-500 text-sm mt-1">{errors.licenseNumber.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('bookingForm.fields.licenseDate')}
                  </label>
                  <input
                    {...register('licenseDate')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.licenseDate && (
                    <p className="text-yellow-500 text-sm mt-1">{errors.licenseDate.message}</p>
                  )}
                </div>
              </form>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">{t('bookingForm.confirmTitle')}</h3>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('bookingForm.carLabel')}</span>
                    <span className="font-semibold">
                      {selectedCar.brand} {selectedCar.model}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('bookingForm.periodLabel')}</span>
                    <span className="font-semibold">
                      {rentalDays} {pluralizeDays(rentalDays, t)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('bookingForm.rentalCostLabel')}</span>
                    <span className="font-semibold">
                      {formatCurrency(calculateRentalTotal(selectedCar.pricePerDay, rentalDays))}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {t('bookingForm.currentDailyRate', { price: formatCurrency(dailyRate), days: rentalDays })}
                    </span>
                    {dailyRate < selectedCar.pricePerDay && (
                      <span className="text-green-600 font-medium">
                        {t('bookingForm.discountLabel', { percent: Math.round((1 - dailyRate / selectedCar.pricePerDay) * 100) })}
                      </span>
                    )}
                  </div>

                  {selectedServices.length > 0 && (
                    <>
                      <div className="border-t pt-4">
                        <p className="text-gray-600 mb-2">{t('bookingForm.extraServicesLabel')}</p>
                        {selectedServices.map(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          if (!service) return null;

                          return (
                            <div key={serviceId} className="flex justify-between ml-4">
                              <span className="text-gray-600">{pickLocalized(service.name, i18n.language)}:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  service.pricePerDay
                                    ? service.pricePerDay * rentalDays
                                    : service.price
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">{t('bookingForm.totalLabel')}</span>
                      <span className="font-bold text-primary-600">
                        {formatCurrency(calculateTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    {t('bookingForm.managerNotice')}
                  </p>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{submitError}</p>
                  </div>
                )}

                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium mb-2">{t('bookingForm.fillStep3')}</p>
                    <ul className="text-sm text-red-700 list-disc list-inside">
                      {errors.firstName && <li>{errors.firstName.message}</li>}
                      {errors.lastName && <li>{errors.lastName.message}</li>}
                      {errors.email && <li>{errors.email.message}</li>}
                      {errors.phone && <li>{errors.phone.message}</li>}
                      {errors.birthDate && <li>{errors.birthDate.message}</li>}
                      {errors.licenseNumber && <li>{errors.licenseNumber.message}</li>}
                      {errors.licenseDate && <li>{errors.licenseDate.message}</li>}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevStep}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t('bookingForm.back')}
            </Button>
          )}

          <div className="ml-auto">
            {currentStep < STEP_DEFS.length ? (
              <Button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && (!bookingDates.start || !bookingDates.end)) ||
                  (currentStep === 3 && Object.keys(errors).length > 0)
                }
              >
                {t('bookingForm.next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('bookingForm.submitting')}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t('bookingForm.submit')}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {calculateTotal > 0 && (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-primary-900 font-medium">{t('bookingForm.previewTotal')}</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatCurrency(calculateTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
