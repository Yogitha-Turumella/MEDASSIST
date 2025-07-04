import React, { useState } from 'react';
import { Star, Send, ThumbsUp, ThumbsDown, Meh, Heart } from 'lucide-react';

interface FeedbackSentimentProps {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  onSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  categories: {
    communication: number;
    professionalism: number;
    timeliness: number;
    effectiveness: number;
  };
}

export const FeedbackSentiment: React.FC<FeedbackSentimentProps> = ({
  appointmentId,
  doctorId,
  patientId,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState({
    communication: 0,
    professionalism: 0,
    timeliness: 0,
    effectiveness: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = [
      'excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'outstanding',
      'helpful', 'professional', 'caring', 'thorough', 'knowledgeable',
      'satisfied', 'happy', 'pleased', 'recommend', 'thank'
    ];
    
    const negativeWords = [
      'terrible', 'awful', 'horrible', 'bad', 'poor', 'disappointing',
      'rude', 'unprofessional', 'late', 'rushed', 'dismissive',
      'unsatisfied', 'unhappy', 'frustrated', 'waste', 'complaint'
    ];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    const sentiment = analyzeSentiment(comment);
    const feedbackData: FeedbackData = {
      rating,
      comment,
      sentiment,
      categories
    };

    try {
      await onSubmit(feedbackData);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case 'negative': return <ThumbsDown className="h-5 w-5 text-red-500" />;
      default: return <Meh className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-200 bg-green-50';
      case 'negative': return 'border-red-200 bg-red-50';
      default: return 'border-yellow-200 bg-yellow-50';
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Feedback!</h2>
        <p className="text-gray-600 mb-6">
          Your feedback helps us improve our healthcare services and ensures the best care for all patients.
        </p>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            Your feedback has been analyzed and will be used to enhance our platform and doctor performance.
          </p>
        </div>
      </div>
    );
  }

  const currentSentiment = analyzeSentiment(comment);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-2 transition-colors duration-200 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                <Star className="h-8 w-8 fill-current" />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 5 ? 'Excellent!' : 
               rating === 4 ? 'Very Good' : 
               rating === 3 ? 'Good' : 
               rating === 2 ? 'Fair' : 'Poor'}
            </p>
          )}
        </div>

        {/* Category Ratings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rate Specific Aspects
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categories).map(([category, value]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 capitalize">
                    {category === 'timeliness' ? 'Punctuality' : category}
                  </span>
                  <span className="text-sm text-gray-500">{value}/5</span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCategories(prev => ({ ...prev, [category]: star }))}
                      className={`transition-colors duration-200 ${
                        star <= value ? 'text-blue-400' : 'text-gray-300 hover:text-blue-300'
                      }`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Share Your Experience
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about your experience with the doctor and our service..."
          />
          
          {/* Sentiment Analysis Display */}
          {comment.length > 10 && (
            <div className={`mt-3 p-3 rounded-lg border ${getSentimentColor(currentSentiment)}`}>
              <div className="flex items-center">
                {getSentimentIcon(currentSentiment)}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Sentiment Analysis: {currentSentiment.charAt(0).toUpperCase() + currentSentiment.slice(1)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Our AI analyzes your feedback to help us understand your experience better.
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Submitting Feedback...
            </div>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Submit Feedback
            </>
          )}
        </button>
      </form>

      {/* Feedback Benefits */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Why Your Feedback Matters</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Helps doctors improve their patient care</li>
          <li>• Assists other patients in choosing the right doctor</li>
          <li>• Enables us to enhance our platform features</li>
          <li>• Contributes to better healthcare outcomes</li>
        </ul>
      </div>
    </div>
  );
};