import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalendarCell from './CalendarCell';
import { generateCalendarData } from '@/utils/marketData';

const Calendar = ({ view, selectedDate, selectedDateRange, onDateSelect, onDateRangeSelect, selectedInstrument, colorScheme = 'default', zoomLevel = 1 }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);

  useEffect(() => {
    // Generate market data for current view
    const data = generateCalendarData(currentDate, view, selectedInstrument);
    setCalendarData(data);
  }, [currentDate, view, selectedInstrument]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateYear = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    onDateSelect(new Date());
  };

  const handleDateClick = (date) => {
    if (!isSelecting) {
      onDateSelect(date);
      setSelectionStart(date);
      setIsSelecting(true);
    } else {
      const start = selectionStart < date ? selectionStart : date;
      const end = selectionStart < date ? date : selectionStart;
      onDateRangeSelect({ start, end });
      setIsSelecting(false);
      setSelectionStart(null);
    }
  };

  const isDateInRange = (date) => {
    if (!selectedDateRange) return false;
    return date >= selectedDateRange.start && date <= selectedDateRange.end;
  };

  const isDateRangeStart = (date) => {
    return selectedDateRange && date.getTime() === selectedDateRange.start.getTime();
  };

  const isDateRangeEnd = (date) => {
    return selectedDateRange && date.getTime() === selectedDateRange.end.getTime();
  };

  const renderCalendarHeader = () => {
    const monthYear = currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });

    return (
      <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateYear(-1)}
            className="hover:bg-calendar-hover transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
            className="hover:bg-calendar-hover transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">{monthYear}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
            className="hover:bg-calendar-hover transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateYear(1)}
            className="hover:bg-calendar-hover transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const cells = [];

    // Previous month's trailing days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, 0 - (startingDayOfWeek - 1 - i));
      cells.push(
        <CalendarCell
          key={`prev-${i}`}
          date={prevMonthDay}
          isCurrentMonth={false}
          data={calendarData[prevMonthDay.toDateString()]}
          onSelect={handleDateClick}
          isSelected={selectedDate && selectedDate.toDateString() === prevMonthDay.toDateString()}
          isInRange={isDateInRange(prevMonthDay)}
          isRangeStart={isDateRangeStart(prevMonthDay)}
          isRangeEnd={isDateRangeEnd(prevMonthDay)}
          view={view}
          colorScheme={colorScheme}
        />
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      cells.push(
        <CalendarCell
          key={day}
          date={cellDate}
          isCurrentMonth={true}
          data={calendarData[cellDate.toDateString()]}
          onSelect={handleDateClick}
          isSelected={selectedDate && selectedDate.toDateString() === cellDate.toDateString()}
          isInRange={isDateInRange(cellDate)}
          isRangeStart={isDateRangeStart(cellDate)}
          isRangeEnd={isDateRangeEnd(cellDate)}
          view={view}
          colorScheme={colorScheme}
        />
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
    for (let i = cells.length; i < totalCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i - startingDayOfWeek - daysInMonth + 1);
      cells.push(
        <CalendarCell
          key={`next-${i}`}
          date={nextMonthDay}
          isCurrentMonth={false}
          data={calendarData[nextMonthDay.toDateString()]}
          onSelect={handleDateClick}
          isSelected={selectedDate && selectedDate.toDateString() === nextMonthDay.toDateString()}
          isInRange={isDateInRange(nextMonthDay)}
          isRangeStart={isDateRangeStart(nextMonthDay)}
          isRangeEnd={isDateRangeEnd(nextMonthDay)}
          view={view}
          colorScheme={colorScheme}
        />
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {cells}
      </div>
    );
  };

  return (
    <div className={`bg-calendar-bg p-6 rounded-lg border border-border transition-all duration-300 ${colorScheme === 'high-contrast' ? 'contrast-more' : ''} ${colorScheme === 'colorblind' ? 'colorblind-friendly' : ''}`}>
      {renderCalendarHeader()}
      {renderDaysOfWeek()}
      {renderCalendarGrid()}
      
      {/* Range Selection Helper */}
      {isSelecting && selectionStart && (
        <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            Click another date to select a range starting from {selectionStart.toLocaleDateString()}
          </p>
          <button 
            onClick={() => {
              setIsSelecting(false);
              setSelectionStart(null);
            }}
            className="text-xs text-primary hover:underline mt-1"
          >
            Cancel selection
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;