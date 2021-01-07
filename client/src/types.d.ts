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
};

export type Query = {
  __typename?: 'Query';
  shifts: ShiftsResult;
  shift: ShiftPayload;
  days: DaysResult;
  employees: EmployeesResult;
};


export type QueryShiftArgs = {
  id: Scalars['String'];
};

export type ShiftsResult = {
  __typename?: 'ShiftsResult';
  result?: Maybe<Array<Shift>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Shift = {
  __typename?: 'Shift';
  id: Scalars['String'];
  title: Scalars['String'];
  duration: Scalars['Int'];
};

export type ShiftPayload = {
  __typename?: 'ShiftPayload';
  result?: Maybe<Shift>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type DaysResult = {
  __typename?: 'DaysResult';
  result?: Maybe<Array<Day>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Day = {
  __typename?: 'Day';
  id: Scalars['String'];
  name: DayName;
  order: Scalars['Int'];
  active: Scalars['Boolean'];
};

export enum DayName {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY'
}

export type EmployeesResult = {
  __typename?: 'EmployeesResult';
  result?: Maybe<Array<Employee>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['String'];
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays?: Maybe<Array<Day>>;
  skills: Array<EmployeeSkill>;
};

export type EmployeeSkill = {
  __typename?: 'EmployeeSkill';
  shift: Shift;
  employee: Employee;
  level: ShiftSkillLevel;
};

export enum ShiftSkillLevel {
  NoSkill = 'NO_SKILL',
  Learning = 'LEARNING',
  Master = 'MASTER'
}

export type Mutation = {
  __typename?: 'Mutation';
  createShift?: Maybe<ShiftPayload>;
  updateShift?: Maybe<ShiftPayload>;
  deleteShift: Result;
  createEmployee?: Maybe<EmployeePayload>;
  updateEmployee?: Maybe<EmployeePayload>;
  deleteEmployee: Result;
  toggleDayActivation?: Maybe<ToggleDayActivationPayload>;
  createOrganization: Scalars['Boolean'];
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


export type MutationToggleDayActivationArgs = {
  input: ToggleDayActivationInput;
};

export type CreateShiftInput = {
  title: Scalars['String'];
  duration: Scalars['Int'];
};

export type UpdateShiftInput = {
  id: Scalars['String'];
  title: Scalars['String'];
  duration: Scalars['Int'];
};

export type Result = {
  __typename?: 'Result';
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CreateEmployeeInput = {
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays: Array<DayName>;
  skills: Array<ShiftSkillInput>;
};

export type ShiftSkillInput = {
  shift: Scalars['String'];
  level: ShiftSkillLevel;
};

export type EmployeePayload = {
  __typename?: 'EmployeePayload';
  result?: Maybe<Employee>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type UpdateEmployeeInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays: Array<DayName>;
  skills: Array<ShiftSkillInput>;
};

export type ToggleDayActivationInput = {
  id: Scalars['String'];
  active: Scalars['Boolean'];
};

export type ToggleDayActivationPayload = {
  __typename?: 'ToggleDayActivationPayload';
  result?: Maybe<Day>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};
