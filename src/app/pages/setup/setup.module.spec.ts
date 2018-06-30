import { SetupModule } from './setup.module';

describe('SetupModule', () => {
  let setupModule: SetupModule;

  beforeEach(() => {
    setupModule = new SetupModule();
  });

  it('should create an instance', () => {
    expect(setupModule).toBeTruthy();
  });
});
