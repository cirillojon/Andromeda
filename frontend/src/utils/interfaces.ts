export interface DbUser {
    id: string;
    email: string;
    name: string;
    created_at: string;
    message:string;
}
  
export interface Project {
    id: string;
    project_name: string;
    project_address: string;
    start_date: string;
    end_date: string;
    status: string;
    project_type: string;
    financing_type_id: string;
    user_id: string;
    message: string;
}