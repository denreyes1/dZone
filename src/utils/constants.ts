import type { Scene, AmbientSound, SoundCategory } from '@/types';

export const SCENES: Scene[] = [
  {
    id: 'ambience-1',
    name: 'Ambience I',
    description: 'Immersive looping video backdrop',
    videoId: 'z9Ug-3qhrwY',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    id: 'ambience-2',
    name: 'Ambience II',
    description: 'Immersive looping video backdrop',
    videoId: 'lGphuanCRDk',
    gradient: 'linear-gradient(135deg, #2d1b0e 0%, #1a1207 50%, #0f0d08 100%)',
  },
  {
    id: 'ambience-3',
    name: 'Ambience III',
    description: 'Immersive looping video backdrop',
    videoId: 'h9yya-j_kjE',
    gradient: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #0a0a20 100%)',
  },
  {
    id: 'ambience-4',
    name: 'Ambience IV',
    description: 'Immersive looping video backdrop',
    videoId: 'ssz9IHUEfC4',
    gradient: 'linear-gradient(135deg, #1c1410 0%, #2a1f15 50%, #0f0c08 100%)',
  },
  {
    id: 'ambience-5',
    name: 'Ambience V',
    description: 'Immersive looping video backdrop',
    videoId: 'ArDi0mV15vY',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1f1f1f 100%)',
  },
];

export const SOUND_CATEGORIES: { id: SoundCategory; label: string; icon: string }[] = [
  { id: 'rain', label: 'Rain', icon: 'CloudRain' },
  { id: 'nature', label: 'Nature', icon: 'TreePine' },
  { id: 'animals', label: 'Animals', icon: 'Bird' },
  { id: 'places', label: 'Places', icon: 'Coffee' },
  { id: 'noise', label: 'Noise', icon: 'AudioLines' },
  { id: 'transport', label: 'Transport', icon: 'TrainFront' },
  { id: 'things', label: 'Things', icon: 'Cog' },
  { id: 'urban', label: 'Urban', icon: 'Building2' },
];

export const AMBIENT_SOUNDS: AmbientSound[] = [
  // Rain
  { id: 'light-rain', name: 'Light Rain', icon: 'CloudDrizzle', url: '/sounds/rain/light-rain.mp3', category: 'rain' },
  { id: 'heavy-rain', name: 'Heavy Rain', icon: 'CloudRain', url: '/sounds/rain/heavy-rain.mp3', category: 'rain' },
  { id: 'rain-on-window', name: 'Rain on Window', icon: 'AppWindow', url: '/sounds/rain/rain-on-window.mp3', category: 'rain' },
  { id: 'rain-on-umbrella', name: 'Rain on Umbrella', icon: 'Umbrella', url: '/sounds/rain/rain-on-umbrella.mp3', category: 'rain' },
  { id: 'rain-on-tent', name: 'Rain on Tent', icon: 'Tent', url: '/sounds/rain/rain-on-tent.mp3', category: 'rain' },
  { id: 'rain-on-leaves', name: 'Rain on Leaves', icon: 'Leaf', url: '/sounds/rain/rain-on-leaves.mp3', category: 'rain' },
  { id: 'rain-on-car-roof', name: 'Rain on Car Roof', icon: 'Car', url: '/sounds/rain/rain-on-car-roof.mp3', category: 'rain' },
  { id: 'thunder', name: 'Thunder', icon: 'CloudLightning', url: '/sounds/rain/thunder.mp3', category: 'rain' },

  // Nature
  { id: 'campfire', name: 'Campfire', icon: 'Flame', url: '/sounds/nature/campfire.mp3', category: 'nature' },
  { id: 'waves', name: 'Waves', icon: 'Waves', url: '/sounds/nature/waves.mp3', category: 'nature' },
  { id: 'river', name: 'River', icon: 'Waves', url: '/sounds/nature/river.mp3', category: 'nature' },
  { id: 'waterfall', name: 'Waterfall', icon: 'Droplets', url: '/sounds/nature/waterfall.mp3', category: 'nature' },
  { id: 'droplets', name: 'Droplets', icon: 'Droplets', url: '/sounds/nature/droplets.mp3', category: 'nature' },
  { id: 'wind', name: 'Wind', icon: 'Wind', url: '/sounds/nature/wind.mp3', category: 'nature' },
  { id: 'howling-wind', name: 'Howling Wind', icon: 'Wind', url: '/sounds/nature/howling-wind.mp3', category: 'nature' },
  { id: 'wind-in-trees', name: 'Wind in Trees', icon: 'TreePine', url: '/sounds/nature/wind-in-trees.mp3', category: 'nature' },
  { id: 'jungle', name: 'Jungle', icon: 'TreePalm', url: '/sounds/nature/jungle.mp3', category: 'nature' },
  { id: 'walk-in-snow', name: 'Walk in Snow', icon: 'Snowflake', url: '/sounds/nature/walk-in-snow.mp3', category: 'nature' },
  { id: 'walk-on-gravel', name: 'Walk on Gravel', icon: 'Footprints', url: '/sounds/nature/walk-on-gravel.mp3', category: 'nature' },
  { id: 'walk-on-leaves', name: 'Walk on Leaves', icon: 'Leaf', url: '/sounds/nature/walk-on-leaves.mp3', category: 'nature' },

  // Animals
  { id: 'birds', name: 'Birds', icon: 'Bird', url: '/sounds/animals/birds.mp3', category: 'animals' },
  { id: 'crickets', name: 'Crickets', icon: 'Bug', url: '/sounds/animals/crickets.mp3', category: 'animals' },
  { id: 'owl', name: 'Owl', icon: 'Bird', url: '/sounds/animals/owl.mp3', category: 'animals' },
  { id: 'seagulls', name: 'Seagulls', icon: 'Bird', url: '/sounds/animals/seagulls.mp3', category: 'animals' },
  { id: 'crows', name: 'Crows', icon: 'Bird', url: '/sounds/animals/crows.mp3', category: 'animals' },
  { id: 'woodpecker', name: 'Woodpecker', icon: 'Bird', url: '/sounds/animals/woodpecker.mp3', category: 'animals' },
  { id: 'cat-purring', name: 'Cat Purring', icon: 'Cat', url: '/sounds/animals/cat-purring.mp3', category: 'animals' },
  { id: 'dog-barking', name: 'Dog Barking', icon: 'Dog', url: '/sounds/animals/dog-barking.mp3', category: 'animals' },
  { id: 'frog', name: 'Frog', icon: 'Bug', url: '/sounds/animals/frog.mp3', category: 'animals' },
  { id: 'whale', name: 'Whale', icon: 'Fish', url: '/sounds/animals/whale.mp3', category: 'animals' },
  { id: 'wolf', name: 'Wolf', icon: 'Dog', url: '/sounds/animals/wolf.mp3', category: 'animals' },
  { id: 'beehive', name: 'Beehive', icon: 'Bug', url: '/sounds/animals/beehive.mp3', category: 'animals' },
  { id: 'chickens', name: 'Chickens', icon: 'Egg', url: '/sounds/animals/chickens.mp3', category: 'animals' },
  { id: 'cows', name: 'Cows', icon: 'MilkOff', url: '/sounds/animals/cows.mp3', category: 'animals' },
  { id: 'sheep', name: 'Sheep', icon: 'Cloud', url: '/sounds/animals/sheep.mp3', category: 'animals' },
  { id: 'horse-gallop', name: 'Horse Gallop', icon: 'Rabbit', url: '/sounds/animals/horse-gallop.mp3', category: 'animals' },

  // Places
  { id: 'cafe', name: 'Café', icon: 'Coffee', url: '/sounds/places/cafe.mp3', category: 'places' },
  { id: 'library', name: 'Library', icon: 'BookOpen', url: '/sounds/places/library.mp3', category: 'places' },
  { id: 'office', name: 'Office', icon: 'Briefcase', url: '/sounds/places/office.mp3', category: 'places' },
  { id: 'restaurant', name: 'Restaurant', icon: 'UtensilsCrossed', url: '/sounds/places/restaurant.mp3', category: 'places' },
  { id: 'crowded-bar', name: 'Crowded Bar', icon: 'Wine', url: '/sounds/places/crowded-bar.mp3', category: 'places' },
  { id: 'church', name: 'Church', icon: 'Church', url: '/sounds/places/church.mp3', category: 'places' },
  { id: 'temple', name: 'Temple', icon: 'Landmark', url: '/sounds/places/temple.mp3', category: 'places' },
  { id: 'night-village', name: 'Night Village', icon: 'Moon', url: '/sounds/places/night-village.mp3', category: 'places' },
  { id: 'airport', name: 'Airport', icon: 'Plane', url: '/sounds/places/airport.mp3', category: 'places' },
  { id: 'subway-station', name: 'Subway Station', icon: 'TrainFront', url: '/sounds/places/subway-station.mp3', category: 'places' },
  { id: 'supermarket', name: 'Supermarket', icon: 'ShoppingCart', url: '/sounds/places/supermarket.mp3', category: 'places' },
  { id: 'laboratory', name: 'Laboratory', icon: 'FlaskConical', url: '/sounds/places/laboratory.mp3', category: 'places' },
  { id: 'laundry-room', name: 'Laundry Room', icon: 'WashingMachine', url: '/sounds/places/laundry-room.mp3', category: 'places' },
  { id: 'construction-site', name: 'Construction Site', icon: 'Hammer', url: '/sounds/places/construction-site.mp3', category: 'places' },
  { id: 'carousel', name: 'Carousel', icon: 'FerrisWheel', url: '/sounds/places/carousel.mp3', category: 'places' },
  { id: 'underwater', name: 'Underwater', icon: 'Anchor', url: '/sounds/places/underwater.mp3', category: 'places' },

  // Noise
  { id: 'white-noise', name: 'White Noise', icon: 'Radio', url: '/sounds/noise/white-noise.wav', category: 'noise' },
  { id: 'brown-noise', name: 'Brown Noise', icon: 'AudioLines', url: '/sounds/noise/brown-noise.wav', category: 'noise' },
  { id: 'pink-noise', name: 'Pink Noise', icon: 'AudioWaveform', url: '/sounds/noise/pink-noise.wav', category: 'noise' },

  // Transport
  { id: 'train', name: 'Train', icon: 'TrainFront', url: '/sounds/transport/train.mp3', category: 'transport' },
  { id: 'inside-a-train', name: 'Inside a Train', icon: 'TrainFront', url: '/sounds/transport/inside-a-train.mp3', category: 'transport' },
  { id: 'airplane', name: 'Airplane', icon: 'Plane', url: '/sounds/transport/airplane.mp3', category: 'transport' },
  { id: 'sailboat', name: 'Sailboat', icon: 'Sailboat', url: '/sounds/transport/sailboat.mp3', category: 'transport' },
  { id: 'rowing-boat', name: 'Rowing Boat', icon: 'Ship', url: '/sounds/transport/rowing-boat.mp3', category: 'transport' },
  { id: 'submarine', name: 'Submarine', icon: 'Anchor', url: '/sounds/transport/submarine.mp3', category: 'transport' },

  // Things
  { id: 'keyboard', name: 'Keyboard', icon: 'Keyboard', url: '/sounds/things/keyboard.mp3', category: 'things' },
  { id: 'typewriter', name: 'Typewriter', icon: 'Type', url: '/sounds/things/typewriter.mp3', category: 'things' },
  { id: 'clock', name: 'Clock', icon: 'Clock', url: '/sounds/things/clock.mp3', category: 'things' },
  { id: 'ceiling-fan', name: 'Ceiling Fan', icon: 'Fan', url: '/sounds/things/ceiling-fan.mp3', category: 'things' },
  { id: 'wind-chimes', name: 'Wind Chimes', icon: 'Bell', url: '/sounds/things/wind-chimes.mp3', category: 'things' },
  { id: 'singing-bowl', name: 'Singing Bowl', icon: 'Bell', url: '/sounds/things/singing-bowl.mp3', category: 'things' },
  { id: 'vinyl-effect', name: 'Vinyl Effect', icon: 'Disc', url: '/sounds/things/vinyl-effect.mp3', category: 'things' },
  { id: 'boiling-water', name: 'Boiling Water', icon: 'Thermometer', url: '/sounds/things/boiling-water.mp3', category: 'things' },
  { id: 'bubbles', name: 'Bubbles', icon: 'CircleDot', url: '/sounds/things/bubbles.mp3', category: 'things' },
  { id: 'paper', name: 'Paper', icon: 'FileText', url: '/sounds/things/paper.mp3', category: 'things' },
  { id: 'dryer', name: 'Dryer', icon: 'Wind', url: '/sounds/things/dryer.mp3', category: 'things' },
  { id: 'washing-machine', name: 'Washing Machine', icon: 'WashingMachine', url: '/sounds/things/washing-machine.mp3', category: 'things' },
  { id: 'slide-projector', name: 'Slide Projector', icon: 'Projector', url: '/sounds/things/slide-projector.mp3', category: 'things' },
  { id: 'morse-code', name: 'Morse Code', icon: 'Radio', url: '/sounds/things/morse-code.mp3', category: 'things' },
  { id: 'tuning-radio', name: 'Tuning Radio', icon: 'Radio', url: '/sounds/things/tuning-radio.mp3', category: 'things' },
  { id: 'windshield-wipers', name: 'Windshield Wipers', icon: 'Car', url: '/sounds/things/windshield-wipers.mp3', category: 'things' },

  // Urban
  { id: 'busy-street', name: 'Busy Street', icon: 'Building2', url: '/sounds/urban/busy-street.mp3', category: 'urban' },
  { id: 'traffic', name: 'Traffic', icon: 'Car', url: '/sounds/urban/traffic.mp3', category: 'urban' },
  { id: 'highway', name: 'Highway', icon: 'Car', url: '/sounds/urban/highway.mp3', category: 'urban' },
  { id: 'road', name: 'Road', icon: 'Car', url: '/sounds/urban/road.mp3', category: 'urban' },
  { id: 'crowd', name: 'Crowd', icon: 'Users', url: '/sounds/urban/crowd.mp3', category: 'urban' },
  { id: 'ambulance-siren', name: 'Ambulance Siren', icon: 'Siren', url: '/sounds/urban/ambulance-siren.mp3', category: 'urban' },
  { id: 'fireworks', name: 'Fireworks', icon: 'Sparkles', url: '/sounds/urban/fireworks.mp3', category: 'urban' },
];

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_TIMER: ' ',
  TOGGLE_FULLSCREEN: 'f',
  TOGGLE_TASKS: 't',
  TOGGLE_MIXER: 'm',
  TOGGLE_SCENES: 's',
  ESCAPE: 'Escape',
} as const;
