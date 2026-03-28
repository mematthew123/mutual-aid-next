/**
 * Generate an ICS calendar file data URI from event information.
 */

function formatIcsDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

interface CalendarEvent {
  title: string;
  startDateTime: string;
  endDateTime?: string;
  location?: {
    venue?: string;
    address?: string;
  };
}

export function generateIcsUrl(event: CalendarEvent): string {
  const start = formatIcsDate(event.startDateTime);

  // Default to 2 hours after start if no end time
  const end = event.endDateTime
    ? formatIcsDate(event.endDateTime)
    : formatIcsDate(
        new Date(
          new Date(event.startDateTime).getTime() + 2 * 60 * 60 * 1000
        ).toISOString()
      );

  const locationParts = [event.location?.venue, event.location?.address].filter(
    Boolean
  );
  const location = locationParts.length > 0 ? locationParts.join(", ") : "";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mutual Aid Network//Events//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcs(event.title)}`,
  ];

  if (location) {
    lines.push(`LOCATION:${escapeIcs(location)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  const icsContent = lines.join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}
