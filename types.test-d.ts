import {expectType} from 'tsd';
import {loadConfig, loadConfigSync} from '.';

expectType<{
  environmentVariables: {
    environmentVariable: string | void;
    implicitEnvironmentVariable: string | void;
    numericEnvironmentVariable: number | void;
    requiredEnvironmentVariable: string;
    requiredNumericEnvironmentVariable: number;
    requiredStringEnvironmentVariable: string;
    stringEnvironmentVariable: string | void;
  };
  secrets: {
    numericSecret: number | void;
    requiredNumericSecret: number;
    requiredSecret: string;
    requiredStringSecret: string;
    secret: string | void;
    stringSecret: string | void;
  };
}>(
  loadConfigSync({
    environmentVariables: {
      environmentVariable: {
        variableName: 'ENVIRONMENT_VARIABLE',
      },
      implicitEnvironmentVariable: 'IMPLICIT_ENVIRONMENT_VARIABLE',
      numericEnvironmentVariable: {
        type: 'number',
        variableName: 'NUMERIC_ENVIRONMENT_VARIABLE',
      },
      requiredEnvironmentVariable: {
        required: true,
        variableName: 'REQUIRED_ENVIRONMENT_VARIABLE',
      },
      requiredNumericEnvironmentVariable: {
        required: true,
        type: 'number',
        variableName: 'REQUIRED_NUMERIC_ENVIRONMENT_VARIABLE',
      },
      requiredStringEnvironmentVariable: {
        required: true,
        type: 'string',
        variableName: 'REQUIRED_STRING_ENVIRONMENT_VARIABLE',
      },
      stringEnvironmentVariable: {
        type: 'string',
        variableName: 'STRING_ENVIRONMENT_VARIABLE',
      },
    },
    secrets: {
      numericSecret: {
        filePath: '/numeric/secret',
        type: 'number',
      },
      requiredNumericSecret: {
        filePath: '/required/numeric/secret',
        required: true,
        type: 'number',
      },
      requiredSecret: {
        filePath: '/required/secret',
        required: true,
      },
      requiredStringSecret: {
        filePath: '/required/string/secret',
        required: true,
        type: 'string',
      },
      secret: {
        filePath: '/secret',
      },
      stringSecret: {
        filePath: '/string/secret',
        type: 'string',
      },
    },
  }),
);

expectType<
  Promise<{
    environmentVariables: {
      environmentVariable: string | void;
      implicitEnvironmentVariable: string | void;
      numericEnvironmentVariable: number | void;
      requiredEnvironmentVariable: string;
      requiredNumericEnvironmentVariable: number;
      requiredStringEnvironmentVariable: string;
      stringEnvironmentVariable: string | void;
    };
    secrets: {
      numericSecret: number | void;
      requiredNumericSecret: number;
      requiredSecret: string;
      requiredStringSecret: string;
      secret: string | void;
      stringSecret: string | void;
    };
  }>
>(
  // This actually does have to be a seperate declaration, since having it as a const'll make `type` a string.
  loadConfig({
    environmentVariables: {
      environmentVariable: {
        variableName: 'ENVIRONMENT_VARIABLE',
      },
      implicitEnvironmentVariable: 'IMPLICIT_ENVIRONMENT_VARIABLE',
      numericEnvironmentVariable: {
        type: 'number',
        variableName: 'NUMERIC_ENVIRONMENT_VARIABLE',
      },
      requiredEnvironmentVariable: {
        required: true,
        variableName: 'REQUIRED_ENVIRONMENT_VARIABLE',
      },
      requiredNumericEnvironmentVariable: {
        required: true,
        type: 'number',
        variableName: 'REQUIRED_NUMERIC_ENVIRONMENT_VARIABLE',
      },
      requiredStringEnvironmentVariable: {
        required: true,
        type: 'string',
        variableName: 'REQUIRED_STRING_ENVIRONMENT_VARIABLE',
      },
      stringEnvironmentVariable: {
        type: 'string',
        variableName: 'STRING_ENVIRONMENT_VARIABLE',
      },
    },
    secrets: {
      numericSecret: {
        filePath: '/numeric/secret',
        type: 'number',
      },
      requiredNumericSecret: {
        filePath: '/required/numeric/secret',
        required: true,
        type: 'number',
      },
      requiredSecret: {
        filePath: '/required/secret',
        required: true,
      },
      requiredStringSecret: {
        filePath: '/required/string/secret',
        required: true,
        type: 'string',
      },
      secret: {
        filePath: '/secret',
      },
      stringSecret: {
        filePath: '/string/secret',
        type: 'string',
      },
    },
  }),
);
