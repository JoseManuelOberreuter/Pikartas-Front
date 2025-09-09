// Transbank Payment Service
// Handles all Transbank Webpay Plus API calls

const BASE_URL = 'http://localhost:4005/api/payments'

class TransbankService {
  constructor() {
    this.baseURL = BASE_URL
  }

  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Initiate payment with Transbank
  async initiatePayment(shippingAddress) {
    try {
      const response = await fetch(`${this.baseURL}/initiate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ shippingAddress })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error initiating payment:', error)
      throw error
    }
  }

  // Confirm payment after Transbank callback
  async confirmPayment(tokenWs) {
    try {
      const response = await fetch(`${this.baseURL}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token_ws: tokenWs })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw error
    }
  }

  // Get payment status
  async getPaymentStatus(orderId) {
    try {
      const response = await fetch(`${this.baseURL}/status/${orderId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error getting payment status:', error)
      throw error
    }
  }

  // Refund payment
  async refundPayment(orderId, amount = null) {
    try {
      const body = amount ? { amount } : {}
      
      const response = await fetch(`${this.baseURL}/refund/${orderId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error refunding payment:', error)
      throw error
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  }

  // Get stored payment data
  getStoredPaymentData() {
    try {
      const data = sessionStorage.getItem('paymentData')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error parsing stored payment data:', error)
      return null
    }
  }

  // Store payment data
  storePaymentData(data) {
    try {
      sessionStorage.setItem('paymentData', JSON.stringify(data))
    } catch (error) {
      console.error('Error storing payment data:', error)
    }
  }

  // Clear stored payment data
  clearStoredPaymentData() {
    sessionStorage.removeItem('paymentData')
  }
}

// Create and export singleton instance
const transbankService = new TransbankService()
export default transbankService
