// Temperature Tool - Simple MCP tool that returns temperature for a specific country

export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export interface ToolCallResult {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// Mock temperature data for different countries
const temperatureData: Record<string, number> = {
  'united states': 72,
  usa: 72,
  canada: 45,
  'united kingdom': 55,
  uk: 55,
  france: 68,
  germany: 59,
  japan: 73,
  australia: 77,
  brazil: 84,
  india: 89,
  china: 66,
  russia: 32,
  italy: 70,
  spain: 75,
  mexico: 81,
  argentina: 63,
  'south africa': 71,
  egypt: 92,
  thailand: 86,
  sweden: 48,
  norway: 43,
  finland: 41,
  denmark: 52,
  netherlands: 58,
  belgium: 56,
  switzerland: 54,
  austria: 57,
  portugal: 72,
  greece: 76,
  turkey: 69,
  poland: 51,
  'czech republic': 53,
  hungary: 60,
  romania: 62,
  bulgaria: 64,
  croatia: 67,
  serbia: 61,
  slovakia: 52,
  slovenia: 58,
  estonia: 46,
  latvia: 47,
  lithuania: 49,
  ireland: 54,
  iceland: 39,
  'south korea': 68,
  'north korea': 56,
  vietnam: 84,
  philippines: 87,
  indonesia: 88,
  malaysia: 89,
  singapore: 90,
  'new zealand': 65,
  chile: 64,
  peru: 70,
  colombia: 78,
  venezuela: 85,
  ecuador: 76,
  bolivia: 68,
  paraguay: 79,
  uruguay: 67,
  morocco: 78,
  algeria: 82,
  tunisia: 80,
  libya: 88,
  sudan: 95,
  ethiopia: 73,
  kenya: 77,
  uganda: 75,
  tanzania: 79,
  ghana: 82,
  nigeria: 86,
  cameroon: 83,
  congo: 81,
  zambia: 74,
  zimbabwe: 72,
  botswana: 76,
  namibia: 78,
  angola: 80,
  mozambique: 82,
  madagascar: 75,
  mauritius: 81,
  israel: 74,
  jordan: 79,
  lebanon: 72,
  syria: 71,
  iraq: 89,
  iran: 73,
  afghanistan: 65,
  pakistan: 81,
  bangladesh: 85,
  'sri lanka': 84,
  nepal: 63,
  bhutan: 58,
  maldives: 86,
  myanmar: 83,
  cambodia: 87,
  laos: 82,
  mongolia: 34,
  kazakhstan: 48,
  uzbekistan: 70,
  turkmenistan: 77,
  kyrgyzstan: 52,
  tajikistan: 61,
  armenia: 57,
  azerbaijan: 63,
  georgia: 60,
  ukraine: 50,
  belarus: 47,
  moldova: 56,
  albania: 65,
  'bosnia and herzegovina': 59,
  montenegro: 63,
  'north macedonia': 61,
  kosovo: 58,
  cuba: 82,
  jamaica: 85,
  haiti: 84,
  'dominican republic': 83,
  'puerto rico': 82,
  'trinidad and tobago': 86,
  barbados: 84,
  bahamas: 81,
  belize: 83,
  'costa rica': 79,
  panama: 85,
  guatemala: 76,
  honduras: 78,
  'el salvador': 77,
  nicaragua: 81,
};

// Available tools
export const tools: Tool[] = [
  {
    name: 'get_temperature',
    description:
      'Get the current temperature for a specific country. Returns temperature in Fahrenheit.',
    inputSchema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          description:
            'The name of the country to get temperature for (e.g., "United States", "Canada", "France")',
        },
      },
      required: ['country'],
    },
  },
];

// Tool executors
export const toolExecutors: Record<
  string,
  (args: any) => Promise<ToolCallResult>
> = {
  get_temperature: async (args: {
    country: string;
  }): Promise<ToolCallResult> => {
    console.log('🌡️ Getting temperature for country:', args.country);

    if (!args.country) {
      return {
        content: [
          {
            type: 'text',
            text: '❌ Error: Country parameter is required',
          },
        ],
      };
    }

    const country = args.country.toLowerCase().trim();
    const temperature = temperatureData[country];

    if (temperature === undefined) {
      const availableCountries = Object.keys(temperatureData)
        .filter((key) => key.length > 2) // Filter out abbreviations for cleaner list
        .sort()
        .slice(0, 10); // Show first 10 for brevity

      return {
        content: [
          {
            type: 'text',
            text: `❌ Temperature data not available for "${args.country}". 

Available countries include: ${availableCountries.join(', ')}, and many more.

💡 Tip: Try common country names like "United States", "Canada", "France", "Germany", etc.`,
          },
        ],
      };
    }

    const celsius = Math.round(((temperature - 32) * 5) / 9);

    return {
      content: [
        {
          type: 'text',
          text: `🌡️ Current temperature in ${args.country}:
          
🇺🇸 **${temperature}°F** (${celsius}°C)

📍 Country: ${args.country}
🌡️ Temperature: ${temperature}°F / ${celsius}°C
📊 Status: ${
            temperature > 80
              ? 'Hot'
              : temperature > 60
              ? 'Warm'
              : temperature > 40
              ? 'Cool'
              : 'Cold'
          }`,
        },
      ],
    };
  },
};
