import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Car
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useBookingStore } from '../../store/useBookingStore';
import { formatCurrency } from '../../utils/formatters';
import { services } from '../../data/services';
import { offices } from '../../data/offices';
import { differenceInDays } from 'date-fns';

const customerSchema = z.object({
  firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'),
  birthDate: z.string().min(1, 'Укажите дату рождения'),
  licenseNumber: z.string().min(10, 'Введите номер водительского удостоверения'),
  licenseDate: z.string().min(1, 'Укажите дату выдачи прав'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const STEPS = [
  { id: 1, title: 'Выбор дат и места', icon: Calendar },
  { id: 2, title: 'Дополнительные услуги', icon: Package },
  { id: 3, title: 'Данные клиента', icon: User },
  { id: 4, title: 'Подтверждение', icon: Check },
];

const serviceIcons: Record<string, React.ComponentType<any>> = {
  'child-seat': Baby,
  'gps': Navigation,
  'additional-driver': Users,
  'full-insurance': Shield,
  'delivery': Car,
};

export const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
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

  const calculateTotal = useMemo(() => {
    if (!selectedCar) return 0;
    
    const carPrice = selectedCar.pricePerDay * rentalDays;
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
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: CustomerFormData) => {
    setCustomer({
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.birthDate,
      driverLicense: data.licenseNumber,
    });
    
    alert('Бронирование успешно оформлено! Мы свяжемся с вами в ближайшее время.');
    navigate('/');
  };

  if (!selectedCar) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Автомобиль не выбран</h3>
        <p className="text-gray-600 mb-4">Выберите автомобиль для бронирования</p>
        <Button onClick={() => navigate('/cars')}>
          Перейти к каталогу
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 transition-colors ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCar.brand} {selectedCar.model}
          </h2>
          <p className="text-gray-600">
            {formatCurrency(selectedCar.pricePerDay)}/день
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
                      Дата начала аренды
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
                      Дата возврата
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
                      Место получения
                    </label>
                    <select
                      value={locations.pickup}
                      onChange={(e) => setBookingLocations({ ...locations, pickup: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {offices.map(office => (
                        <option key={office.id} value={office.id}>
                          {office.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Место возврата
                    </label>
                    <select
                      value={locations.return}
                      onChange={(e) => setBookingLocations({ ...locations, return: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {offices.map(office => (
                        <option key={office.id} value={office.id}>
                          {office.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {rentalDays > 0 && (
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-primary-900">
                      Срок аренды: <strong>{rentalDays} {rentalDays === 1 ? 'день' : rentalDays < 5 ? 'дня' : 'дней'}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Выберите дополнительные услуги</h3>
                
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
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(service.pricePerDay ? service.pricePerDay : service.price)}
                            {service.pricePerDay && '/день'}
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
                      Имя
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
                      Фамилия
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
                      Email
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
                      Телефон
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
                      Дата рождения
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
                      Номер водительского удостоверения
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
                    Дата выдачи прав
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
                <h3 className="text-lg font-semibold mb-4">Подтверждение заказа</h3>
                
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Автомобиль:</span>
                    <span className="font-semibold">
                      {selectedCar.brand} {selectedCar.model}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Период аренды:</span>
                    <span className="font-semibold">
                      {rentalDays} {rentalDays === 1 ? 'день' : rentalDays < 5 ? 'дня' : 'дней'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Стоимость аренды:</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedCar.pricePerDay * rentalDays)}
                    </span>
                  </div>
                  
                  {selectedServices.length > 0 && (
                    <>
                      <div className="border-t pt-4">
                        <p className="text-gray-600 mb-2">Дополнительные услуги:</p>
                        {selectedServices.map(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          if (!service) return null;
                          
                          return (
                            <div key={serviceId} className="flex justify-between ml-4">
                              <span className="text-gray-600">{service.name}:</span>
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
                      <span className="font-semibold">Итого:</span>
                      <span className="font-bold text-primary-600">
                        {formatCurrency(calculateTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    После подтверждения бронирования наш менеджер свяжется с вами для уточнения деталей и оплаты.
                  </p>
                </div>
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
              Назад
            </Button>
          )}
          
          <div className="ml-auto">
            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && (!bookingDates.start || !bookingDates.end)) ||
                  (currentStep === 3 && Object.keys(errors).length > 0)
                }
              >
                Далее
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit(onSubmit)}
              >
                <Check className="w-4 h-4 mr-2" />
                Подтвердить бронирование
              </Button>
            )}
          </div>
        </div>

        {calculateTotal > 0 && (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-primary-900 font-medium">Предварительная стоимость:</span>
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