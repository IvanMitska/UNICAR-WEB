import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';

interface HeroDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minDate?: Date;
}

export const HeroDatePicker: React.FC<HeroDatePickerProps> = ({
  value,
  onChange,
  placeholder,
  minDate = new Date()
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

  // Calculate start date (Monday of the first week)
  const startDate = new Date(monthStart);
  const dayOfWeek = monthStart.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
  startDate.setDate(startDate.getDate() - daysToSubtract);

  // Always show 6 weeks (42 days) for consistent height
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 41);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateSelect = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    return isBefore(date, min);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm focus:outline-none"
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDate ? format(selectedDate, 'dd.MM.yyyy') : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div
          className="absolute z-[9999] bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
          style={{ width: '300px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <h3 className="text-sm font-medium text-gray-900 capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </h3>

            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
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
                    w-9 h-9 text-sm rounded-full m-0.5 transition-colors
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                    ${isSelected ? 'bg-gray-900 text-white' : ''}
                    ${isToday && !isSelected ? 'bg-gray-100 font-medium' : ''}
                    ${!isDisabled && !isSelected ? 'hover:bg-gray-100' : ''}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className="flex-1 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Сегодня
            </button>
            <button
              type="button"
              onClick={() => handleDateSelect(new Date(Date.now() + 24 * 60 * 60 * 1000))}
              className="flex-1 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Завтра
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
