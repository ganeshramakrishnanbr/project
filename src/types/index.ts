export interface Medication {
  id: string;
  name: string;
}

export type AnswerValue = 
  | string 
  | number 
  | boolean 
  | Medication[] 
  | string[]
  | { [rowId: string]: { [columnId: string]: boolean } };

export interface Answer {
  value: AnswerValue;
  unit?: string;
}

export interface AnswerState {
  [key: string]: Answer;
}

export type QuestionType = 
  | 'numeric' 
  | 'boolean' 
  | 'text' 
  | 'medication'
  | 'time'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'dropdown'
  | 'matrix';

export type MatrixColumnType = 'radio' | 'checkbox';

export interface MatrixColumn {
  id: string;
  label: string;
  type: MatrixColumnType;
}

export interface MatrixRow {
  id: string;
  text: string;
  values: { [columnId: string]: boolean };
}

export interface MatrixData {
  columns: MatrixColumn[];
  rows: MatrixRow[];
  label?: string;
  optionsLabel?: string;
  showNoneOption?: boolean;
}

export interface Question {
  id: string;
  text: string;
  sectionName: string;
  type: QuestionType;
  isModalOpen?: boolean;
  min?: number;
  max?: number;
  units?: string[];
  options?: string[];
  required?: boolean;
  condition?: {
    questionId: string;
    value: string | number | boolean | string[];
  };
  subQuestions?: Question[];
  matrixData?: MatrixData;
}

export interface QuestionTemplate {
  state: string;
  questions: Question[];
  sleepQuestions?: Question[];
  avocationQuestions?: Question[];
  diabetesQuestions?: Question[];
}