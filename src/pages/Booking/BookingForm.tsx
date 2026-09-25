import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useCreateReservation } from "@/hooks/api/useReservations"
import { BOOKING_WINDOW, VALIDATION } from "@/constants"
import { ROUTES } from "@/utils/const"
import { logger } from "@/utils/logger"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Mail, Phone, User, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { BookingFormValues, bookingSchema } from "./utils/bookingSchema"

const minimumBookingTimeForDate = (date: Date) => {
  const selectedDate = new Date(date)
  selectedDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate.getTime() !== today.getTime()) return BOOKING_WINDOW.OPEN

  const minimumDateTime = new Date(
    Date.now() + VALIDATION.MIN_ADVANCE_BOOKING_MINUTES * 60 * 1000,
  )
  const time = `${String(minimumDateTime.getHours()).padStart(2, '0')}:${String(minimumDateTime.getMinutes()).padStart(2, '0')}`
  return time < BOOKING_WINDOW.OPEN ? BOOKING_WINDOW.OPEN : time
}

const BOOKING_HOURS = Array.from(
  { length: Number(BOOKING_WINDOW.LAST_BOOKING.slice(0, 2)) - Number(BOOKING_WINDOW.OPEN.slice(0, 2)) + 1 },
  (_, index) => Number(BOOKING_WINDOW.OPEN.slice(0, 2)) + index,
)
const BOOKING_MINUTES = Array.from({ length: 12 }, (_, index) => index * 5)

const toTimeString = (hour: number, minute: number) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

export const BookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()
  const createReservation = useCreateReservation()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [minTime, setMinTime] = useState<string>(BOOKING_WINDOW.OPEN)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      date: new Date(),
      guests: 1, // Number to match schema transformation
      specialRequests: "",
    },
  })
  const selectedTime = form.watch('time')

  useEffect(() => {
    setMinTime(minimumBookingTimeForDate(form.getValues('date')))
  }, [])

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true)
    try {
      logger.debug('Booking form submitted with data:', data)
      
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        // Send a calendar date, not a browser-timezone timestamp. The booking
        // date must remain the same business day on every server timezone.
        reservationDate: format(data.date, 'yyyy-MM-dd'),
        reservationTime: data.time,
        numberOfGuests: Number(data.guests), // Convert to number for API
        note: data.specialRequests || undefined,
        userId: user?.id,
      }
      
      logger.debug('Sending reservation payload:', payload)
      
      await createReservation.mutateAsync(payload)
      
      form.reset()
      navigate(ROUTES.BOOKING_SUCCESS)
    } catch (error) {
      logger.error('Reservation creation failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue('date', date)
      setIsCalendarOpen(false)
      
      const nextMinTime = minimumBookingTimeForDate(date)
      setMinTime(nextMinTime)

      // A time that was valid for another date may be too soon today.
      if (form.getValues('time') && form.getValues('time') < nextMinTime) {
        form.setValue('time', '', { shouldValidate: true })
      }
    }
  }

  const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
    const [currentHour, currentMinute] = (form.getValues('time') || minTime)
      .split(':')
      .map(Number)
    const nextTime = toTimeString(
      type === 'hour' ? value : currentHour,
      type === 'minute' ? value : currentMinute,
    )

    if (nextTime >= minTime && nextTime <= BOOKING_WINDOW.LAST_BOOKING) {
      form.setValue('time', nextTime, { shouldValidate: true, shouldDirty: true })
    }
  }

  const isTimeAvailable = (hour: number, minute: number) => {
    const time = toTimeString(hour, minute)
    return time >= minTime && time <= BOOKING_WINDOW.LAST_BOOKING
  }

  return (
    <Card className="border-amber-200 dark:border-amber-800/50 bg-white/90 dark:bg-slate-800/80 backdrop-blur shadow-xl">
      <CardHeader className="bg-primary-gradient text-white rounded-t-xl pb-5">
        <CardTitle className="text-xl md:text-2xl">{t.bookingFormTitle}</CardTitle>
        <CardDescription className="text-amber-100 text-sm md:text-base">
          {t.bookingFormDesc}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5 md:pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t.fullName}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.fullNamePlaceholder}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t.phoneNumber}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.phonePlaceholder}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t.email}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.emailPlaceholder}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {t.dateTime}
                    </FormLabel>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 h-11 text-left font-normal border-amber-200 focus:border-amber-500 focus:ring-amber-500 hover:bg-primary-gradient hover:text-white hover:border-transparent ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value && selectedTime ? (
                              format(field.value, "dd/MM/yyyy") + ` ${selectedTime}`
                            ) : (
                              <span>{t.bookingSelectDate} &amp; {t.bookingSelectTime}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start">
                        <div className="sm:flex">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={handleDateSelect}
                            disabled={(date) => {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              return date < today
                            }}
                            initialFocus
                            className="rounded-lg border-amber-200"
                            classNames={{
                              day: "h-9 w-9 p-0 font-normal aria-selected:bg-primary-gradient aria-selected:text-white hover:bg-primary-gradient hover:text-white transition-colors",
                              day_today: "bg-primary-gradient text-white",
                              day_selected: "bg-primary-gradient text-white hover:bg-primary-gradient hover:text-white",
                              day_disabled: "text-muted-foreground opacity-50",
                            }}
                          />
                          <div className="flex border-t border-amber-100 sm:h-[330px] sm:border-l sm:border-t-0">
                            <ScrollArea className="w-1/2 sm:w-20">
                              <div className="flex gap-1 p-2 sm:flex-col">
                                {BOOKING_HOURS.map((hour) => {
                                  const isSelected = selectedTime?.startsWith(`${String(hour).padStart(2, '0')}:`)
                                  const available = BOOKING_MINUTES.some((minute) => isTimeAvailable(hour, minute))
                                  return (
                                    <Button key={hour} type="button" size="sm" variant={isSelected ? "default" : "ghost"} disabled={!available} className="shrink-0 sm:w-full" onClick={() => handleTimeChange('hour', hour)}>
                                      {String(hour).padStart(2, '0')}
                                    </Button>
                                  )
                                })}
                              </div>
                              <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>
                            <ScrollArea className="w-1/2 sm:w-20">
                              <div className="flex gap-1 p-2 sm:flex-col">
                                {BOOKING_MINUTES.map((minute) => {
                                  const hour = Number((selectedTime || minTime).slice(0, 2))
                                  const isSelected = selectedTime?.endsWith(`:${String(minute).padStart(2, '0')}`)
                                  return (
                                    <Button key={minute} type="button" size="sm" variant={isSelected ? "default" : "ghost"} disabled={!isTimeAvailable(hour, minute)} className="shrink-0 sm:w-full" onClick={() => handleTimeChange('minute', minute)}>
                                      {String(minute).padStart(2, '0')}
                                    </Button>
                                  )
                                })}
                              </div>
                              <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={() => (
                  <FormItem className="mt-2">
                    <FormDescription className="text-xs text-amber-600">
                      {t.bookingTimeHelp}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t.numberOfGuests}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      placeholder={t.bookingGuestsPlaceholder}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.bookingSpecialRequests}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.bookingSpecialRequestsPlaceholder}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 resize-none text-sm md:text-base"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t.bookingSpecialRequestsDesc}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary-gradient hover:opacity-90 text-white font-semibold h-12 text-base shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.bookingSubmitting : t.bookingSubmitButton}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
