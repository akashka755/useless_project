export interface CaptchaTile {
  id: number;
  title: string;
  emoji: string;
  scenario: string;
  isDread: boolean;
}

export const CAPTCHA_TILES: CaptchaTile[] = [
  {
    id: 1,
    title: '7:01 PM Friday Slack Ping',
    emoji: '🏢',
    scenario: 'Office lights turn off automatically. Your monitor glows with "Team, urgent client emergency".',
    isDread: true,
  },
  {
    id: 2,
    title: '"Quick Chat?" from HR',
    emoji: '💬',
    scenario: 'Calendar invite arrived at 4:58 PM with no agenda and an external conference link.',
    isDread: true,
  },
  {
    id: 3,
    title: 'Golden Retriever in Sunflowers',
    emoji: '🐕',
    scenario: 'A sweet pup happily chasing a yellow butterfly through summer meadows.',
    isDread: false, // Trick non-dread!
  },
  {
    id: 4,
    title: 'Final_v7_ACTUAL_FINAL_v2.xlsx',
    emoji: '📊',
    scenario: 'A corrupted spreadsheet with 48,000 merged rows and a circular reference error.',
    isDread: true,
  },
  {
    id: 5,
    title: '2:43 AM Mirror Stare',
    emoji: '🪞',
    scenario: 'Brushing teeth in the dim bathroom while suddenly realizing you are mortal and your spine hurts.',
    isDread: true,
  },
  {
    id: 6,
    title: 'Bank Balance: ₹14.30',
    emoji: '💸',
    scenario: 'It is the 11th of the month. Rent is due tomorrow. Swiggy delivery fee is ₹49.',
    isDread: true,
  },
  {
    id: 7,
    title: 'Blinking Cursor on Blank Doc',
    emoji: '📄',
    scenario: 'Page 1 of 40. Deadline in 14 minutes. The little vertical line mocks your entire lineage.',
    isDread: true,
  },
  {
    id: 8,
    title: 'Fresh Warm Croissant with Honey',
    emoji: '🥐',
    scenario: 'A buttery, flaky pastry baked 3 minutes ago with fresh organic butter.',
    isDread: false, // Trick non-dread!
  },
  {
    id: 9,
    title: 'High School Reunion WhatsApp Group',
    emoji: '🎓',
    scenario: 'The guy who ate chalk in 5th grade just bought his 3rd commercial real estate portfolio.',
    isDread: true,
  },
];
