const API_BASE_URL = 'http://10.227.121.179:5000/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Auth
  async login(regno: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ regno, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  }

  // Admin - Users
  async createUser(userData: { name: string; regno: string; password: string; year?: string; branch?: string; section?: string; phone?: string }) {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }
    
    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  }

  async deleteUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    
    return response.json();
  }

  // Admin - Questions
  async uploadQuestions(formData: FormData) {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/questions/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload questions');
    }
    
    return response.json();
  }

  async getQuestions() {
    const response = await fetch(`${API_BASE_URL}/admin/questions`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    
    return response.json();
  }

  async deleteQuestion(questionId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete question');
    }
    
    return response.json();
  }

  // Student - Tests
  async getTestQuestions(category: string, subcategory: string) {
    const response = await fetch(`${API_BASE_URL}/questions/${category}/${subcategory}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch test questions');
    }
    
    return response.json();
  }

  async submitTest(testData: {
    category: string;
    subcategory: string;
    answers: { questionId: string; userAnswer: string }[];
    timeTaken: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/test/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(testData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit test');
    }
    
    return response.json();
  }

  async getResults() {
    const response = await fetch(`${API_BASE_URL}/results`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch results');
    }
    
    return response.json();
  }

  async getRankings() {
    const response = await fetch(`${API_BASE_URL}/rankings`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch rankings');
    }
    
    return response.json();
  }
}

export const apiService = new ApiService();