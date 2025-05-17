const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Activity = require('../models/Activity');

class RecommendationService {
    /**
     * Fetch course recommendations for a user.
     * This method generates recommendations based on user activity, progress, or predefined criteria.
     *
     * @param {String} userId - The ID of the user to generate recommendations for.
     * @returns {Array} - An array of recommended course IDs.
     */
    static async getRecommendations(userId) {
        try {
            // Step 1: Fetch user activity and progress data
            const userProgress = await Progress.find({ userId }).select('courseId percentage');
            const userActivities = await Activity.find({ userId }).select('courseId action');

            // Step 2: Determine the courses the user is actively learning
            const activeCourses = userProgress
                .filter(progress => progress.percentage < 50) // Less than 50% completed
                .map(progress => progress.courseId.toString());

            // Step 3: Add courses from recent activities
            const recentCourses = userActivities.map(activity => activity.courseId.toString());

            // Step 4: Combine active and recent courses
            const interestedCourseIds = [...new Set([...activeCourses, ...recentCourses])];

            // Step 5: Recommend other courses in the same categories or by ratings
            const recommendations = await Course.find({
                _id: { $nin: interestedCourseIds }, // Exclude already active/recent courses
                rating: { $gte: 4.0 }, // Filter courses with high ratings
            })
                .sort({ rating: -1 }) // Sort by ratings in descending order
                .limit(5) // Return up to 5 recommendations
                .select('_id'); // Only fetch the IDs

            return recommendations.map(course => course._id.toString());
        } catch (error) {
            console.error('Error in RecommendationService:', error);
            throw new Error('Failed to generate course recommendations');
        }
    }
}

module.exports = RecommendationService;
