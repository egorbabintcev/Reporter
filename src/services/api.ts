import dayjs from 'dayjs';

import httpClient from '@/transport/http.ts';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AuthApi {
  type SignInRequest = {
    login: string
    password: string
  };
  type SignInResponse = {
    token: string
  };

  export async function signIn(request: SignInRequest) {
    const requestUrl = `/api/v1/sign_in`;

    const response = await httpClient.post<SignInResponse>(requestUrl, request);

    return response.data;
  }

  type SignUpRequest = {
    display_name: string
    login: string
    password: string
  };
  type SignUpResponse = void;

  export async function signUp(request: SignUpRequest) {
    const requestUrl = `/api/v1/sign_up`;

    await httpClient.post<SignUpResponse>(requestUrl, request);
  }

  type GetAuthProviderUrlResponse = {
    uri: string
  };

  export async function getAuthProviderUrl() {
    const requestUrl = `/api/v1/auth/provider`;

    const response = await httpClient.post<GetAuthProviderUrlResponse>(requestUrl);

    return response.data;
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProfileApi {
  export type Profile = {
    id: string
    display_name: string
    login: string
  };

  type GetProfileResponse = Profile;

  export async function getProfile(): Promise<GetProfileResponse> {
    const requestUrl = `/api/v1/profile`;

    const response = await httpClient.get<GetProfileResponse>(requestUrl);

    return response.data;
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EmailApi {
  type SendMailRequest = {
    email: string
    password: string
    recipients: string[]
    subject: string
    body: string
  };
  type SendMailResponse = void;

  export async function sendEmail(request: SendMailRequest): Promise<SendMailResponse> {
    const requestUrl = `/api/v1/send_email`;

    await httpClient.post<SendMailResponse>(requestUrl, request);
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LaborCalendarApi {
  type GetLaborCalendarRequest = {
    date_from: number
    date_to: number
  };
  type GetLaborCalendarResponse = {
    working_days: number
    day_offs: number
  };

  export async function getLaborCalendar(request: GetLaborCalendarRequest): Promise<GetLaborCalendarResponse> {
    const requestUrl = `https://isdayoff.ru/api/getdata`;

    const params = {
      date1: dayjs(request.date_from).format('YYYYMMDD'),
      date2: dayjs(request.date_to).format('YYYYMMDD'),
    };

    const response = await httpClient.get<string>(requestUrl, {
      params,
      responseType: 'text',
      transitional: {
        silentJSONParsing: false,
        forcedJSONParsing: false,
      },
    });

    const parsedResponse = response.data
      .split('')
      .map(Number);

    const workingDays = parsedResponse
      .filter((num) => num === 0)
      .length;
    const dayOffs = parsedResponse
      .filter((num) => num === 1)
      .length;

    return {
      working_days: workingDays,
      day_offs: dayOffs,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReportsApi {
  export type Report = {
    id: string
    creator_id: string
    created_at: number

    display_name: string

    date: number
    start_time: number
    end_time: number
    work_time: number
    break_time: number

    body: string
  };

  type GetReportRequest = {
    report_id: string
  };

  type GetReportResponse = {
    report: Report
  };

  export async function getReport(request: GetReportRequest): Promise<GetReportResponse> {
    const requestUrl = `/api/v1/reports/${encodeURIComponent(request.report_id)}`;

    const response = await httpClient.get<GetReportResponse>(requestUrl);

    return response.data;
  }

  type GetReportsRequest = {
    date_from?: number
    date_to?: number
  };

  type GetReportsResponse = {
    count: number
    reports: Report[]
  };

  export async function getReports(request: GetReportsRequest): Promise<GetReportsResponse> {
    const requestUrl = `/api/v1/reports`;

    const response = await httpClient.get<GetReportsResponse>(requestUrl, {
      params: request,
    });

    return response.data;
  }

  type CreateReportRequest = Omit<Report, 'id' | 'creator_id' | 'created_at'>;

  type CreateReportResponse = Pick<Report, 'id' | 'created_at'>;

  export async function createReport(request: CreateReportRequest): Promise<CreateReportResponse> {
    const requestUrl = `/api/v1/reports`;

    const response = await httpClient.post<CreateReportResponse>(requestUrl, request);

    return response.data;
  }

  type UpdateReportRequest = {
    report_id: string
  } & Partial<Omit<Report, 'id' | 'creator_id' | 'created_at'>>;

  type UpdateReportResponse = void;

  export async function updateReport(request: UpdateReportRequest): Promise<UpdateReportResponse> {
    const requestUrl = `/api/v1/reports/${encodeURIComponent(request.report_id)}`;

    const response = await httpClient.put<UpdateReportResponse>(requestUrl, {
      ...request,
      report_id: undefined,
    });

    return response.data;
  }

  type DeleteReportRequest = {
    report_id: string
  };

  type DeleteReportResponse = void;

  export async function deleteReport(request: DeleteReportRequest): Promise<DeleteReportResponse> {
    const requestUrl = `/api/v1/reports/${encodeURIComponent(request.report_id)}`;

    const response = await httpClient.delete<DeleteReportResponse>(requestUrl);

    return response.data;
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StatsApi {
  export type Stats = {
    avg_hours_break: number
    avg_hours_worked: number
    avg_start_time: number
    hours_worked: number
  };

  type GetStatsRequest = {
    from_date: number
    to_date: number
  };
  type GetStatsResponse = Stats;

  export async function getStats(request: GetStatsRequest): Promise<GetStatsResponse> {
    const requestUrl = `/api/v1/stats`;

    const response = await httpClient.get<GetStatsResponse>(requestUrl, {
      params: request,
    });

    return response.data;
  }
}
