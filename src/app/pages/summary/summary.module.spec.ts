import { SummaryModule } from './summary.module';

describe('SummaryModule', () => {
  let summaryModule: SummaryModule;

  beforeEach(() => {
    summaryModule = new SummaryModule();
  });

  it('should create an instance', () => {
    expect(summaryModule).toBeTruthy();
  });
});
