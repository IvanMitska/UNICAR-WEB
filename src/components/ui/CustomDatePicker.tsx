import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  minDate?: Date;
  maxDate?: Date;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  minDate = new Date(),
  maxDate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateSelect = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return false;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-400 mb-3">
        <Calendar className="inline w-4 h-4 mr-2 text-yellow-400" />
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white text-left ${
          isOpen ? 'ring-2 ring-yellow-500 border-transparent' : 'border-white/10'
        }`}
      >
        {selectedDate ? format(selectedDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
      </button>

      {isOpen && (
        <div
          className="absolute z-[9999] mt-2 bg-dark-900 border border-yellow-500/30 rounded-xl shadow-2xl overflow-hidden"
          style={{ top: '100%', left: '0', width: '100%' }}
        >
          <div className="flex items-center justify-between p-4 border-b border-yellow-500/20">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-yellow-500/20 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4 text-yellow-400" />
            </button>

            <h3 className="text-lg font-semibold text-white">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </h3>

            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-yellow-500/20 rounded-lg"
            >
              <ChevronRight className="w-4 h-4 text-yellow-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-yellow-500/20">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 p-2">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isDisabled = isDateDisabled(date);
              const isToday = isSameDay(date, new Date());

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !isDisabled && handleDateSelect(date)}
                  disabled={isDisabled}
                  className={`
                    p-2 text-sm rounded-lg m-0.5
                    ${isCurrentMonth ? 'text-white' : 'text-gray-600'}
                    ${isSelected ? 'bg-yellow-500 text-black font-bold' : ''}
                    ${isToday && !isSelected ? 'bg-yellow-500/20 text-yellow-400 font-semibold' : ''}
                    ${!isDisabled && !isSelected ? 'hover:bg-yellow-500/20' : ''}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>

          <div className="border-t border-yellow-500/20 p-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="px-3 py-1.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
              >
                Сегодня
              </button>
              <button
                type="button"
                onClick={() => handleDateSelect(new Date(Date.now() + 24 * 60 * 60 * 1000))}
                className="px-3 py-1.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
              >
                Завтра
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};