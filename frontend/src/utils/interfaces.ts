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
    project_type: string;
    user_id: string;
    installer_id: string;
    site_survey_date: string;
    inspection_date: string;
    install_start_date: string;
    end_date: string;
    status: string;
    financing_type: string;
    message: string;
}