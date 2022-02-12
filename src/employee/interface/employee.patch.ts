import { CreateEmployeeDto } from "./employee.dto";

export interface PatchEmployeeDto extends Partial<CreateEmployeeDto>{}