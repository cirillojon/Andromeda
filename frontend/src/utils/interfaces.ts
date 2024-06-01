export interface DbUser {
    id: string;
    email: string;
    name: string;
    created_at: string;
    message?:string;
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
    financing_type_id: string;
    financing_detail_id: string;
    financing_detail: FinancingDetail;
    message?: string;
}

export interface Installer {
    id: string;
    name: string;
    contact_email: string;
    contact_phone: string;
    contact_agent: string;
    message?: string;
}

export interface FinancingDetail {
    id: string;
    project_id: string;
    user_id: string;
    financing_option_id: string;
    total_cost: string;
    monthly_cost: string;
    down_payment: string;
    total_contribution: string;
    remaining_balance: string;
    interest_rate: string;
    payment_status: string;
    payment_due_date: string;
    duration: string;
    message?: string;
}

export interface ProjectStep {
    id: string;
    installer_id: string;
    project_id: string;
    progress_step: string;
    step_date: string;
    message?: string;
}

export interface FinanctionOption {
    id: string;
    option_name: string;
    description: string;
    message?: string;
}