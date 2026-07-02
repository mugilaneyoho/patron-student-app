export interface Course {
    id: number;
    uuid: string;
    batch_id: string;
    staff_id: string;
    staff: string | null;     
    subject: string;         
    start_date: string;       
    start_time: string;      
    end_time: string;         
    batch_name: string;       
    class_mode: string;        
    total_student: number;
    present_student: number;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
    status?: string; 
    venue?: string;
}