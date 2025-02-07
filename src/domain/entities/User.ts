// export class User {
//     constructor(
//         public readonly id: string | null,
//         public name: string,
//         public username: string,
//         public email: string,
//         public password?: string,
//         public contact?: {
//             phone?: string | null;
//         },
//         public profile_picture?: string | null,
//         public education?: {
//             degree?: string | null;
//             end_date?: string | null;
//             institution?: string | null;
//             start_date?: string | null;
//         }[],
//         public job_preference?: object,
//         public job_types?: string[] | null,
//         public industries?: string[] | null,
//         public locations?: string[] | null,
//         public skills?: string[] | null,
//         public created_at?: Date | null,
//         public updated_at?: Date | null,
//         public is_active?: boolean | null,
//         public experience?: {
//             company?: string | null;
//             description?: string | null;
//             end_date?: string | null;
//             start_date?: string | null;
//             title?: string | null;
//         }[]
//     ) {}
// }

export class User {
    public readonly id!: string;
    public name!: string;
    public username!: string;
    public email!: string;
    public password?: string;
    public contact?: { phone?: string | null };
    public profile_picture?: string | null;
    public education?: { degree?: string | null; end_date?: string | null; institution?: string | null; start_date?: string | null }[];
    public job_preference?: object;
    public job_types?: string[] | null;
    public industries?: string[] | null;
    public locations?: string[] | null;
    public skills?: string[] | null;
    public created_at?: Date | null;
    public updated_at?: Date | null;
    public is_active?: boolean | null;
    public experience?: { company?: string | null; description?: string | null; end_date?: string | null; start_date?: string | null; title?: string | null }[];

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}
