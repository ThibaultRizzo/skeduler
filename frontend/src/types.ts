export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Datetime: any;
};

export type Query = {
  __typename?: 'Query';
  shifts: ShiftsPayload;
  days: DaysPayload;
  employees: EmployeesPayload;
  employeeEvents: EmployeeEventsPayload;
  employeeEventsByInterval: EmployeeEventsPayload;
  schedule: SchedulePayload;
  companies: CompaniesPayload;
  company: CompanyPayload;
  sequenceRules: CompanySequenceRulesPayload;
  transitionRules: CompanyTransitionRulesPayload;
};


export type QueryEmployeeEventsArgs = {
  employeeId: Scalars['String'];
};


export type QueryEmployeeEventsByIntervalArgs = {
  employeeId: Scalars['String'];
  startDate: Scalars['Datetime'];
  endDate: Scalars['Datetime'];
};

export type ShiftsPayload = {
  __typename?: 'ShiftsPayload';
  result?: Maybe<Array<Shift>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type Shift = {
  __typename?: 'Shift';
  id: Scalars['String'];
  title: Scalars['String'];
  duration: Scalars['Int'];
  shiftImportance: ShiftImportance;
  coverMonday: Scalars['Int'];
  coverTuesday: Scalars['Int'];
  coverWednesday: Scalars['Int'];
  coverThursday: Scalars['Int'];
  coverFriday: Scalars['Int'];
  coverSaturday: Scalars['Int'];
  coverSunday: Scalars['Int'];
};

export enum ShiftImportance {
  Major = 'MAJOR',
  Average = 'AVERAGE',
  Minor = 'MINOR'
}

export type DaysPayload = {
  __typename?: 'DaysPayload';
  result?: Maybe<Array<Day>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type Day = {
  __typename?: 'Day';
  id: Scalars['String'];
  name: DayEnum;
  order: Scalars['Int'];
  active: Scalars['Boolean'];
};

export enum DayEnum {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY'
}

export type EmployeesPayload = {
  __typename?: 'EmployeesPayload';
  result?: Maybe<Array<Employee>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['String'];
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays?: Maybe<Array<Day>>;
  skills: Array<EmployeeSkill>;
  events: Array<EmployeeEvent>;
};

export type EmployeeSkill = {
  __typename?: 'EmployeeSkill';
  shiftId: Scalars['String'];
  employeeId: Scalars['String'];
  level: ShiftSkillLevel;
};

export enum ShiftSkillLevel {
  NoSkill = 'NO_SKILL',
  Learning = 'LEARNING',
  Master = 'MASTER'
}

export type EmployeeEvent = {
  __typename?: 'EmployeeEvent';
  id: Scalars['String'];
  employee: Employee;
  shift?: Maybe<Shift>;
  startDate: Scalars['Datetime'];
  endDate: Scalars['Datetime'];
  duration: Scalars['Int'];
  type: EventType;
  status: EventStatus;
  nature: EventNature;
  isDesired: Scalars['Boolean'];
};


export enum EventType {
  PaidLeave = 'PAID_LEAVE',
  UnpaidLeave = 'UNPAID_LEAVE',
  Holiday = 'HOLIDAY',
  Illness = 'ILLNESS',
  Request = 'REQUEST'
}

export enum EventStatus {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  Declined = 'DECLINED'
}

export enum EventNature {
  Mandatory = 'MANDATORY',
  Important = 'IMPORTANT',
  Wanted = 'WANTED',
  Prefered = 'PREFERED'
}

export type EmployeeEventsPayload = {
  __typename?: 'EmployeeEventsPayload';
  result?: Maybe<Array<EmployeeEvent>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type SchedulePayload = {
  __typename?: 'SchedulePayload';
  result?: Maybe<CompleteSchedule>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type CompleteSchedule = {
  __typename?: 'CompleteSchedule';
  schedule: Array<ScheduleDay>;
  meta: ScheduleMeta;
};

export type ScheduleDay = {
  __typename?: 'ScheduleDay';
  day: Scalars['String'];
  shifts: Array<ScheduleShift>;
};

export type ScheduleShift = {
  __typename?: 'ScheduleShift';
  shift: Scalars['String'];
  employee: Scalars['String'];
};

export type ScheduleMeta = {
  __typename?: 'ScheduleMeta';
  createdAt: Scalars['Datetime'];
  infeasibleConstraints?: Maybe<Scalars['String']>;
  objective: Scalars['Int'];
};

export type CompaniesPayload = {
  __typename?: 'CompaniesPayload';
  result?: Maybe<Array<CompanySummary>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type CompanySummary = {
  __typename?: 'CompanySummary';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type CompanyPayload = {
  __typename?: 'CompanyPayload';
  result?: Maybe<CompanySummary>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type CompanySequenceRulesPayload = {
  __typename?: 'CompanySequenceRulesPayload';
  result?: Maybe<Array<CompanySequenceRule>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type CompanySequenceRule = {
  __typename?: 'CompanySequenceRule';
  id: Scalars['String'];
  companyId: Scalars['String'];
  ruleType: SequenceRuleType;
  shiftId?: Maybe<Scalars['String']>;
  hardMin: Scalars['Int'];
  softMin: Scalars['Int'];
  penaltyMin: RulePenalty;
  hardMax: Scalars['Int'];
  softMax: Scalars['Int'];
  penaltyMax: RulePenalty;
};

export enum SequenceRuleType {
  ShiftSequence = 'SHIFT_SEQUENCE',
  ShiftSumSequence = 'SHIFT_SUM_SEQUENCE'
}

export enum RulePenalty {
  Hard = 'HARD',
  Medium = 'MEDIUM',
  Soft = 'SOFT'
}

export type CompanyTransitionRulesPayload = {
  __typename?: 'CompanyTransitionRulesPayload';
  result?: Maybe<Array<CompanyTransitionRule>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type CompanyTransitionRule = {
  __typename?: 'CompanyTransitionRule';
  id: Scalars['String'];
  companyId: Scalars['String'];
  fromShiftId?: Maybe<Scalars['String']>;
  toShiftId?: Maybe<Scalars['String']>;
  penalty: RulePenalty;
};

export type Mutation = {
  __typename?: 'Mutation';
  createShift?: Maybe<ShiftPayload>;
  updateShift?: Maybe<ShiftPayload>;
  deleteShift: Payload;
  createEmployee?: Maybe<EmployeePayload>;
  updateEmployee?: Maybe<EmployeePayload>;
  deleteEmployee: Payload;
  createEvent?: Maybe<EmployeeEventPayload>;
  updateEvent?: Maybe<EmployeeEventPayload>;
  deleteEvent?: Maybe<Payload>;
  setDayActivation?: Maybe<SetDayActivationPayload>;
  generateSchedule?: Maybe<SchedulePayload>;
  createCompany?: Maybe<CompanyPayload>;
  updateCompany?: Maybe<CompanyPayload>;
  deleteCompany: Payload;
  createSequenceRule?: Maybe<SequenceRulePayload>;
  updateSequenceRule?: Maybe<SequenceRulePayload>;
  deleteSequenceRule: Payload;
  createTransitionRule?: Maybe<TransitionRulePayload>;
  updateTransitionRule?: Maybe<TransitionRulePayload>;
  deleteTransitionRule: Payload;
};


export type MutationCreateShiftArgs = {
  input: CreateShiftInput;
};


export type MutationUpdateShiftArgs = {
  input: UpdateShiftInput;
};


export type MutationDeleteShiftArgs = {
  id: Scalars['String'];
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationUpdateEmployeeArgs = {
  input: UpdateEmployeeInput;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['String'];
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['String'];
};


export type MutationSetDayActivationArgs = {
  input: SetDayActivationInput;
};


export type MutationGenerateScheduleArgs = {
  input: GenerateScheduleInput;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};


export type MutationDeleteCompanyArgs = {
  id: Scalars['String'];
};


export type MutationCreateSequenceRuleArgs = {
  input: CreateSequenceRuleInput;
};


export type MutationUpdateSequenceRuleArgs = {
  input: UpdateSequenceRuleInput;
};


export type MutationDeleteSequenceRuleArgs = {
  id: Scalars['String'];
};


export type MutationCreateTransitionRuleArgs = {
  input: CreateTransitionRuleInput;
};


export type MutationUpdateTransitionRuleArgs = {
  input: UpdateTransitionRuleInput;
};


export type MutationDeleteTransitionRuleArgs = {
  id: Scalars['String'];
};

export type CreateShiftInput = {
  title: Scalars['String'];
  duration: Scalars['Int'];
  shiftImportance: ShiftImportance;
  coverMonday: Scalars['Int'];
  coverTuesday: Scalars['Int'];
  coverWednesday: Scalars['Int'];
  coverThursday: Scalars['Int'];
  coverFriday: Scalars['Int'];
  coverSaturday: Scalars['Int'];
  coverSunday: Scalars['Int'];
};

export type ShiftPayload = {
  __typename?: 'ShiftPayload';
  result?: Maybe<Shift>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type UpdateShiftInput = {
  id: Scalars['String'];
  title: Scalars['String'];
  duration: Scalars['Int'];
  shiftImportance: ShiftImportance;
  coverMonday: Scalars['Int'];
  coverTuesday: Scalars['Int'];
  coverWednesday: Scalars['Int'];
  coverThursday: Scalars['Int'];
  coverFriday: Scalars['Int'];
  coverSaturday: Scalars['Int'];
  coverSunday: Scalars['Int'];
};

export type Payload = {
  __typename?: 'Payload';
  result?: Maybe<Scalars['Boolean']>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type CreateEmployeeInput = {
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays: Array<DayEnum>;
  skills: Array<ShiftSkillInput>;
};

export type ShiftSkillInput = {
  shiftId: Scalars['String'];
  level: ShiftSkillLevel;
};

export type EmployeePayload = {
  __typename?: 'EmployeePayload';
  result?: Maybe<Employee>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type UpdateEmployeeInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays: Array<DayEnum>;
  skills: Array<ShiftSkillInput>;
};

export type CreateEventInput = {
  employeeId: Scalars['String'];
  shiftId?: Maybe<Scalars['String']>;
  startDate: Scalars['Datetime'];
  duration: Scalars['Int'];
  type: EventType;
  status: EventStatus;
  nature: EventNature;
  isDesired: Scalars['Boolean'];
};

export type EmployeeEventPayload = {
  __typename?: 'EmployeeEventPayload';
  result?: Maybe<EmployeeEvent>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type UpdateEventInput = {
  id: Scalars['String'];
  shiftId?: Maybe<Scalars['String']>;
  startDate: Scalars['Datetime'];
  duration: Scalars['Int'];
  type: EventType;
  status: EventStatus;
  nature: EventNature;
  isDesired: Scalars['Boolean'];
};

export type SetDayActivationInput = {
  id: Scalars['String'];
  active: Scalars['Boolean'];
};

export type SetDayActivationPayload = {
  __typename?: 'SetDayActivationPayload';
  result?: Maybe<Day>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type GenerateScheduleInput = {
  startDate: Scalars['Datetime'];
  nbWeeks: Scalars['Int'];
  opts?: Maybe<Scalars['Boolean']>;
};

export type CreateCompanyInput = {
  name: Scalars['String'];
};

export type UpdateCompanyInput = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type CreateSequenceRuleInput = {
  companyId: Scalars['String'];
  ruleType: SequenceRuleType;
  shiftId?: Maybe<Scalars['String']>;
  hardMin: Scalars['Int'];
  softMin: Scalars['Int'];
  penaltyMin: RulePenalty;
  hardMax: Scalars['Int'];
  softMax: Scalars['Int'];
  penaltyMax: RulePenalty;
};

export type SequenceRulePayload = {
  __typename?: 'SequenceRulePayload';
  result?: Maybe<CompanySequenceRule>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type UpdateSequenceRuleInput = {
  id: Scalars['String'];
  shiftId?: Maybe<Scalars['String']>;
  hardMin: Scalars['Int'];
  softMin: Scalars['Int'];
  penaltyMin: RulePenalty;
  hardMax: Scalars['Int'];
  softMax: Scalars['Int'];
  penaltyMax: RulePenalty;
};

export type CreateTransitionRuleInput = {
  companyId: Scalars['String'];
  fromShiftId?: Maybe<Scalars['String']>;
  toShiftId?: Maybe<Scalars['String']>;
  penalty: RulePenalty;
};

export type TransitionRulePayload = {
  __typename?: 'TransitionRulePayload';
  result?: Maybe<CompanyTransitionRule>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type UpdateTransitionRuleInput = {
  id: Scalars['String'];
  companyId: Scalars['String'];
  fromShiftId?: Maybe<Scalars['String']>;
  toShiftId?: Maybe<Scalars['String']>;
  penalty: RulePenalty;
};

export type Company = {
  __typename?: 'Company';
  id: Scalars['String'];
  name: Scalars['String'];
  workingDays: Array<Day>;
  sequenceRules: Array<CompanySequenceRule>;
  transitionRules: Array<CompanyTransitionRule>;
};
