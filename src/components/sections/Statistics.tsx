import React from 'react';

const stats = [
  { value: '500+', label: 'Автомобилей в парке' },
  { value: '50 000+', label: 'Довольных клиентов' },
  { value: '5', label: 'Лет на рынке' },
  { value: '98%', label: 'Клиентов рекомендуют нас' },
];

export const Statistics: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-950/10 via-transparent to-yellow-950/10"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="text-yellow-500">ShibaCars</span>
            <span className="text-white ml-3">в цифрах</span>
          </h2>
          <p className="text-lg text-gray-400">
            Факты и цифры о нашей компании
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="glass-effect-light rounded-2xl p-8 border border-dark-800/50 hover:border-yellow-500/30 transition-colors duration-300">
                <div className="text-4xl lg:text-5xl font-bold mb-3 text-yellow-400">
                  {stat.value}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};