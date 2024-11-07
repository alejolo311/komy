// @ts-nocheck
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
    from: Date;
    to: Date;
    onSelect: (range: DateRange) => void;
    className?: string;
}

export function DateRangePicker({
    from,
    to,
    onSelect,
    className,
}: DateRangePickerProps) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            'w-[300px] justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700',
                            !from && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {from ? (
                            to ? (
                                <>
                                    {format(from, 'PP', { locale: es })} -{' '}
                                    {format(to, 'PP', { locale: es })}
                                </>
                            ) : (
                                format(from, 'PP', { locale: es })
                            )
                        ) : (
                            <span>Seleccione un rango de fechas</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 bg-gray-800 border-gray-700"
                    align="start"
                >
                    <Calendar

                        mode="range"
                        defaultMonth={from}
                        selected={{ from, to }}
                        onSelect={onSelect}
                        numberOfMonths={2}
                        locale={es}
                        className="text-white"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}