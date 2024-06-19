export interface DbUser {
    id: string; //not null
    email: string; // not null
    name: string; // not null
    created_at: string; // not null
    message?:string;
}
  
export interface Project {
    id: string; // not null
    project_name: string; // not null
    project_type: string; // not null
    financing_detail: FinancingDetail; // not null
    project_address?: string;
    end_date?: string;
    status?: string;
    financing_type_id?: string;
    user_id?: string;
    installer_id?: string;
    site_survey_date?: string;
    inspection_date?: string;
    install_start_date?: string;
    financing_detail_id?: string;
    created_at: string;
    roof_sqft?: string;
    hvac_details?: string;
    solar_electric_bill_kwh?: string;
    sola_panel_amount?: string;
    solar_panel_wattage?: string;
    solar_yearly_kwh?: string;
    solar_battery_type?: string;
    solar_microinverter?: string;
    roof_angle?: string;
    roof_current_type?: string;
    roof_new_type?: string;
    roof_current_health?: string;
    message?: string;
}

export interface Installer {
    id: string; // not null
    name: string; // not null
    contact_email: string; // not null
    contact_phone?: string;
    contact_agent?: string;
    project_type?: string;
    message?: string;
}

export interface FinancingDetail {
    id: string; // not null
    project_id: string; // not null
    user_id: string; // not null
    financing_option_id?: string;
    total_cost?: string;
    monthly_cost?: string;
    down_payment?: string;
    total_contribution?: string;
    remaining_balance?: string;
    interest_rate?: string;
    payment_status?: string;
    payment_due_date?: string;
    duration?: string;
    message?: string;
}

export interface ProjectStep {
    id: string; // not null
    installer_id: string; // not null
    project_id: string; // not null
    progress_step: string; // not null
    step_date?: string;
    message?: string;
}

export interface FinancingOption {
    id: string; // not null
    option_name: string; // not null
    description?: string;
    message?: string;
}