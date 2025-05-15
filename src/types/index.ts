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
  | 'matrix'
  | 'multiselect'
  | 'toggle'
  | 'slider'
  | 'columns';

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
  label?: string;
  description?: string;
  step?: number;
  columnLayout?: {
    columns: number;
    distribution: string;
    children?: { [columnIndex: number]: string[] };  // Array of question IDs per column
  };
  parentId?: string;
  columnIndex?: number;
  isColumnContainer?: boolean;
}

export interface QuestionTemplate {
  state: string;
  questions: Question[];
  sleepQuestions?: Question[];
  avocationQuestions?: Question[];
  diabetesQuestions?: Question[];
}