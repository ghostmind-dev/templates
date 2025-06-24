// Temperature tools - contains all temperature-related tools
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

// Temperature tools
export const tools: Tool[] = [
  {
    name: 'get_temperature',
    description: 'Get the current temperature for a country',
    inputSchema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          description: 'Name of the country to get temperature for',
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
    country?: string;
  }): Promise<ToolCallResult> => {
    const country = args?.country;
    if (!country) {
      throw new Error('Country parameter is required');
    }

    // Generate a random temperature between -20°C and 40°C
    const temperature = Math.floor(Math.random() * 61) - 20;

    console.log(`Temperature requested for ${country}: ${temperature}°C`);

    return {
      content: [
        {
          type: 'text',
          text: `The current temperature in ${country} is ${temperature}°C`,
        },
      ],
    };
  },
};
