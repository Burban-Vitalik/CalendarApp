import { ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

export function getGraphQLConfig(): ApolloDriverConfig {
  return {
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    playground: true,
    context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
  };
}
