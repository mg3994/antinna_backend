export type EnvironmentType = 'development' | 'production' | 'staging';

export interface AppEnv {
  ENV: EnvironmentType;
  DEBUG: boolean;
}
