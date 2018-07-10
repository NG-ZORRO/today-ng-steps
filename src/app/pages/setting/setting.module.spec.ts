import { SettingModule } from './setting.module';

describe('SettingModule', () => {
  let settingModule: SettingModule;

  beforeEach(() => {
    settingModule = new SettingModule();
  });

  it('should create an instance', () => {
    expect(settingModule).toBeTruthy();
  });
});
