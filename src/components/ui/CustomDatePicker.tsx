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
      <label className="block text-sm font-medium text-gray-500 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-left flex items-center justify-between ${
          isOpen ? 'ring-2 ring-gray-900 border-transparent' : 'border-gray-200'
        }`}
      >
        <span>{selectedDate ? format(selectedDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}</span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div
          className="absolute z-[9999] mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          style={{ top: '100%', left: '0', width: '280px' }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <h3 className="text-base font-medium text-gray-900 capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </h3>

            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-400">
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
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                    ${isSelected ? 'bg-gray-900 text-white font-medium' : ''}
                    ${isToday && !isSelected ? 'bg-gray-100 text-gray-900 font-medium' : ''}
                    ${!isDisabled && !isSelected ? 'hover:bg-gray-100' : ''}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 p-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Сегодня
              </button>
              <button
                type="button"
                onClick={() => handleDateSelect(new Date(Date.now() + 24 * 60 * 60 * 1000))}
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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