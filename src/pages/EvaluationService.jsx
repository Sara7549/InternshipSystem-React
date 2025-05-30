/**
 * EvaluationService.js
 * This service provides methods for managing intern evaluations,
 * acting as a bridge between company evaluations and SCAD office views.
 */

class EvaluationService {
  /**
   * Get all evaluations for a specific company
   * @param {string} companyId - The company ID
   * @returns {Object} - Object with intern IDs as keys and evaluation data as values
   */
  static getCompanyEvaluations(companyId) {
    try {
      const evaluations = localStorage.getItem(`evaluations_${companyId}`);
      return evaluations ? JSON.parse(evaluations) : {};
    } catch (error) {
      console.error('Error retrieving evaluations:', error);
      return {};
    }
  }

  /**
   * Get a specific evaluation for an intern
   * @param {string} companyId - The company ID
   * @param {string} internId - The intern ID
   * @returns {Object|null} - The evaluation data or null if not found
   */
  static getInternEvaluation(companyId, internId) {
    const evaluations = this.getCompanyEvaluations(companyId);
    return evaluations[internId] || null;
  }

  /**
   * Save an evaluation for an intern
   * @param {string} companyId - The company ID
   * @param {string} internId - The intern ID
   * @param {Object} evaluationData - The evaluation data
   * @returns {boolean} - Success indicator
   */
  static saveEvaluation(companyId, internId, evaluationData) {
    try {
      const evaluations = this.getCompanyEvaluations(companyId);
      
      // Add timestamp if not provided
      if (!evaluationData.evaluationDate) {
        evaluationData.evaluationDate = new Date().toISOString();
      }
      
      // Save the evaluation
      evaluations[internId] = {
        ...evaluationData,
        internId,
        companyId
      };
      
      localStorage.setItem(`evaluations_${companyId}`, JSON.stringify(evaluations));
      
      // Create notification for SCAD office
      this.createEvaluationNotification(companyId, internId, evaluationData);
      
      return true;
    } catch (error) {
      console.error('Error saving evaluation:', error);
      return false;
    }
  }

  /**
   * Delete an evaluation for an intern
   * @param {string} companyId - The company ID
   * @param {string} internId - The intern ID
   * @returns {boolean} - Success indicator
   */
  static deleteEvaluation(companyId, internId) {
    try {
      const evaluations = this.getCompanyEvaluations(companyId);
      
      if (evaluations[internId]) {
        delete evaluations[internId];
        localStorage.setItem(`evaluations_${companyId}`, JSON.stringify(evaluations));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      return false;
    }
  }

  /**
   * Get all evaluations across all companies
   * This is for SCAD office use
   * @returns {Object} - Object with intern IDs as keys and evaluation data as values
   */
  static getAllEvaluations() {
    try {
      // Get all localStorage keys that start with "evaluations_"
      const evaluationKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('evaluations_'));
      
      // Combine all evaluations into one object
      const allEvaluations = {};
      evaluationKeys.forEach(key => {
        const companyEvaluations = JSON.parse(localStorage.getItem(key)) || {};
        Object.assign(allEvaluations, companyEvaluations);
      });
      
      return allEvaluations;
    } catch (error) {
      console.error('Error retrieving all evaluations:', error);
      return {};
    }
  }

  /**
   * Get all interns across all companies
   * This is for SCAD office use
   * @returns {Array} - Array of intern objects
   */
  static getAllInterns() {
    try {
      // Get all localStorage keys that start with "interns_"
      const internKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('interns_'));
      
      // Combine all interns into one array
      let allInterns = [];
      internKeys.forEach(key => {
        const companyInterns = JSON.parse(localStorage.getItem(key)) || [];
        allInterns = [...allInterns, ...companyInterns];
      });
      
      return allInterns;
    } catch (error) {
      console.error('Error retrieving all interns:', error);
      return [];
    }
  }

  /**
   * Create a notification for the SCAD office when a new evaluation is added
   * @private
   * @param {string} companyId - The company ID
   * @param {string} internId - The intern ID
   * @param {Object} evaluationData - The evaluation data
   */
  static createEvaluationNotification(companyId, internId, evaluationData) {
    try {
      // Get the intern details
      const interns = JSON.parse(localStorage.getItem(`interns_${companyId}`)) || [];
      const intern = interns.find(i => i.id === internId);
      
      if (!intern) return;
      
      // Get SCAD office notifications
      const scadId = 'scad_office'; // A special ID for the SCAD office
      const notifications = JSON.parse(localStorage.getItem(`notifications_${scadId}`)) || [];
      
      // Add new notification
      notifications.unshift({
        id: Date.now().toString(),
        type: 'new_evaluation',
        internId,
        internName: intern.name,
        internshipTitle: intern.internshipTitle,
        companyId,
        timestamp: new Date().toISOString(),
        read: false,
        recommendedForHire: evaluationData.recommendForHire
      });
      
      // Save notifications
      localStorage.setItem(`notifications_${scadId}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error creating evaluation notification:', error);
    }
  }
}

export default EvaluationService;