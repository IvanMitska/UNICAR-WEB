import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, User, Camera, Shield, Truck, ChevronDown,
  Calendar, CreditCard, DollarSign, Fuel, Route, AlertTriangle
} from 'lucide-react';

interface TermsSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const TermsSection: React.FC<TermsSectionProps> = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-dark-700/50 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between bg-dark-900/50 hover:bg-dark-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-6 bg-dark-900/30 border-t border-dark-700/50">
          {children}
        </div>
      )}
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { t } = useTranslation('pages');

  const stats = [
    { value: t('termsPage.stats.minAgeValue'), label: t('termsPage.stats.minAgeLabel') },
    { value: t('termsPage.stats.experienceValue'), label: t('termsPage.stats.experienceLabel') },
    { value: t('termsPage.stats.mileageValue'), label: t('termsPage.stats.mileageLabel') },
    { value: t('termsPage.stats.supportValue'), label: t('termsPage.stats.supportLabel') },
  ];

  return (
    <div className="bg-black min-h-screen py-12 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-white">{t('termsPage.titlePart1')} </span>
            <span className="text-yellow-400">{t('termsPage.titlePart2')}</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('termsPage.subtitle')}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-dark-900/50 border border-dark-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl lg:text-3xl font-bold text-yellow-500 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-4">
          <TermsSection title={t('termsPage.driverReqs')} icon={User} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl">
                <Calendar className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{t('termsPage.age')}</div>
                  <div className="text-gray-400 text-sm">{t('termsPage.ageDetails')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl">
                <User className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{t('termsPage.experience')}</div>
                  <div className="text-gray-400 text-sm">{t('termsPage.experienceDetails')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl">
                <FileText className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{t('termsPage.passport')}</div>
                  <div className="text-gray-400 text-sm">{t('termsPage.passportDetails')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl">
                <CreditCard className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{t('termsPage.license')}</div>
                  <div className="text-gray-400 text-sm">{t('termsPage.licenseDetails')}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  {t('termsPage.warning')}
                </p>
              </div>
            </div>
          </TermsSection>

          <TermsSection title={t('termsPage.bookingTitle')} icon={Camera}>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">1</div>
                <div>
                  <div className="font-semibold text-white">{t('termsPage.passportPhoto')}</div>
                  <div className="text-gray-400 text-sm">{t('termsPage.passportPhotoDetails')}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">2</div>
                <div>
                  <div className="font-semibold text-white">{t('termsPage.licensePhoto')}</div>
                  <div className="text-gray-400 text-sm">{t('termsPage.licensePhotoDetails')}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">3</div>
                <div>
                  <div className="font-semibold text-white">{t('termsPage.prepayment')}</div>
                  <div className="text-gray-400 text-sm">{t('termsPage.prepaymentDetails')}</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              {t('termsPage.confirmNote')}
            </p>
          </TermsSection>

          <TermsSection title={t('termsPage.insuranceTitle')} icon={Shield}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-white">{t('termsPage.insurance')}</span>
                </div>
                <p className="text-gray-400 text-sm">{t('termsPage.insuranceText')}</p>
              </div>
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-white">{t('termsPage.deposit')}</span>
                </div>
                <p className="text-gray-400 text-sm">{t('termsPage.depositText')}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="font-semibold text-white mb-1">{t('termsPage.franchiseTitle')}</div>
              <p className="text-gray-400 text-sm">
                {t('termsPage.franchiseText')}
              </p>
            </div>
          </TermsSection>

          <TermsSection title={t('termsPage.deliveryMileage')} icon={Truck}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-yellow-500" /> {t('termsPage.delivery')}
                </h4>
                <div className="p-3 bg-dark-800/50 rounded-lg text-sm">
                  <span className="text-gray-400">{t('termsPage.deliveryByIsland')}</span>
                  <span className="text-white float-right">{t('termsPage.paid')}</span>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-lg text-sm">
                  <span className="text-gray-400">{t('termsPage.condition')}</span>
                  <span className="text-white float-right">{t('termsPage.conditionValue')}</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Route className="w-5 h-5 text-yellow-500" /> {t('termsPage.mileage')}
                </h4>
                <div className="p-3 bg-dark-800/50 rounded-lg text-sm">
                  <span className="text-gray-400">{t('termsPage.dailyLimit')}</span>
                  <span className="text-yellow-500 font-semibold float-right">{t('termsPage.mileageValue')}</span>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-lg text-sm">
                  <span className="text-gray-400">{t('termsPage.overLimit')}</span>
                  <span className="text-white float-right">{t('termsPage.overLimitValue')}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-dark-800/50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Fuel className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-white">{t('termsPage.returnTitle')}</span>
              </div>
              <p className="text-gray-400 text-sm">
                {t('termsPage.returnText')}
              </p>
            </div>
          </TermsSection>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">{t('termsPage.questions')}</p>
          <a
            href="tel:+66638450372"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            {t('termsPage.callUs')}
          </a>
        </div>
      </div>
    </div>
  );
};
