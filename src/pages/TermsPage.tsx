import React, { useState } from 'react';
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
  return (
    <div className="bg-black min-h-screen py-12 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Условия </span>
            <span className="text-yellow-400">аренды</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Прозрачные правила и выгодные условия. Никаких скрытых платежей
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { value: '22+', label: 'Минимальный возраст' },
            { value: '2 года', label: 'Стаж вождения' },
            { value: '150 км', label: 'Лимит в день' },
            { value: '24/7', label: 'Поддержка' },
          ].map((stat, index) => (
            <div key={index} className="bg-dark-900/50 border border-dark-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl lg:text-3xl font-bold text-yellow-500 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-4">
          <TermsSection title="Требования к водителю" icon={User} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl">
                <Calendar className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Возраст</div>
                  <div className="text-gray-400 text-sm">Не менее 22 лет</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl">
                <User className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Стаж</div>
                  <div className="text-gray-400 text-sm">Не менее 2-х лет</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl">
                <FileText className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Загранпаспорт</div>
                  <div className="text-gray-400 text-sm">Действующий документ</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl">
                <CreditCard className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">МВУ</div>
                  <div className="text-gray-400 text-sm">Международные права обязательны</div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  Без МВУ страховая может отказать в выплате. Риски ремонта берёте на себя.
                </p>
              </div>
            </div>
          </TermsSection>

          <TermsSection title="Бронирование" icon={Camera}>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">1</div>
                <div>
                  <div className="font-semibold text-white">Фото загранпаспорта</div>
                  <div className="text-gray-400 text-sm">Чёткое фото всех страниц</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">2</div>
                <div>
                  <div className="font-semibold text-white">Фото водительского удостоверения</div>
                  <div className="text-gray-400 text-sm">Обе стороны МВУ</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">3</div>
                <div>
                  <div className="font-semibold text-white">Аванс за 2 суток</div>
                  <div className="text-gray-400 text-sm">Предоплата для подтверждения</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              После получения документов подтверждаем бронь в течение 2-х часов.
            </p>
          </TermsSection>

          <TermsSection title="Страховка и депозит" icon={Shield}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-white">Страховка</span>
                </div>
                <p className="text-gray-400 text-sm">Все авто застрахованы по первому классу</p>
              </div>
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-white">Депозит</span>
                </div>
                <p className="text-gray-400 text-sm">$200 — $800 в зависимости от авто</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="font-semibold text-white mb-1">Франшиза</div>
              <p className="text-gray-400 text-sm">
                От 3,000 до 7,000 ฿ (~$85-200) при страховом случае
              </p>
            </div>
          </TermsSection>

          <TermsSection title="Доставка и километраж" icon={Truck}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-yellow-500" /> Доставка
                </h4>
                <div className="p-3 bg-dark-800/50 rounded-lg text-sm">
                  <span className="text-gray-400">По острову</span>
                  <span className="text-white float-right">Платная</span>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-lg text-sm">
                  <span className="text-gray-400">Состояние</span>
                  <span className="text-white float-right">Чистый + полный бак</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Route className="w-5 h-5 text-yellow-500" /> Километраж
                </h4>
                <div className="p-3 bg-dark-800/50 rounded-lg text-sm">
                  <span className="text-gray-400">Лимит в день</span>
                  <span className="text-yellow-500 font-semibold float-right">150 км</span>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-lg text-sm">
                  <span className="text-gray-400">Сверх лимита</span>
                  <span className="text-white float-right">2 ฿/км</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-dark-800/50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Fuel className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-white">Возврат</span>
              </div>
              <p className="text-gray-400 text-sm">
                Нет времени заправлять и мыть? Сделаем за вас (чеки предоставим)
              </p>
            </div>
          </TermsSection>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">Остались вопросы?</p>
          <a
            href="tel:+66638450372"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Позвонить нам
          </a>
        </div>
      </div>
    </div>
  );
};
