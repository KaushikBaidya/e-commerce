import { addFeedback, getUserFeedbacks } from '@/store/shop/feedback-slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { Camera, FileText, MessageCircle, PackageOpen, Send, Star } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import * as yup from 'yup';
import ImageUpload from '../admin-view/image-upload';
import { Button } from '../ui/button';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string(),
  subject: yup.string().required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .required('Please provide your feedback'),
  newsletter: yup.boolean(),
});

export default function FeedbackDialog({ userId }) {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState('idle');

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('general');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageCircle },
    { value: 'auction', label: 'Auction Experience', icon: FileText },
    { value: 'artist', label: 'Artist Support', icon: Camera },
    { value: 'complaint', label: 'Complaint', icon: PackageOpen },
  ];

  const onSubmit = async (data) => {
    console.log('clicked');

    const feedbackData = {
      ...data,
      userId,
      rating,
      feedbackType,
      image: uploadedImageUrl,
    };

    try {
      const response = await dispatch(addFeedback(feedbackData));
      if (response?.payload?.success) {
        setIsSubmitted(true);
        dispatch(getUserFeedbacks(userId));
        toast.success(response.payload.message, {
          action: { label: 'close' },
        });
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
        setRating(0);
        setFeedbackType('general');
      }, 3000);
    }
  };

  return (
    <>
      {isSubmitted ? (
        <div className="text-center p-8">
          <div className="bg-purple-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <Send className="text-purple-600 w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold">Thank you!</h2>
          <p className="text-gray-600">Your feedback has been submitted successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
          <div className="">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              What's your feedback about?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFeedbackType(type.value)}
                    className={`p-3 rounded-lg border-2 flex items-center space-x-2 transition-all duration-200 ${
                      feedbackType === type.value
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 text-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-around gap-4">
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
              <input {...register('name')} className="input-design" placeholder="Your name" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address *
              </label>
              <input {...register('email')} className="input-design" placeholder="your@email.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
              <input
                {...register('phone')}
                className="input-design"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subject *</label>
            <input
              {...register('subject')}
              className="input-design"
              placeholder="Subject of your message"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
            <textarea
              {...register('message')}
              rows={4.5}
              className="input-design resize-none"
              placeholder="Your message"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <ImageUpload
              file={imageFile}
              setFile={setImageFile}
              uploadedUrl={uploadedImageUrl}
              setUploadedUrl={(url) => {
                setUploadedImageUrl(url);
                setValue('image', url);
              }}
              imageLoadingState={imageLoadingState}
              setImageLoadingState={setImageLoadingState}
              setFormData={(data) => {
                if (data?.public_id) {
                  setValue('imagePublicId', data.public_id);
                }
              }}
            />
            <input type="hidden" {...register('image')} />
            <input type="hidden" {...register('imagePublicId')} />
          </div>

          <div className="flex items-start space-x-3 bg-purple-50 p-4 rounded-lg">
            <input
              type="checkbox"
              {...register('newsletter')}
              className="mt-1 h-4 w-4 text-purple-600"
            />
            <label className="text-sm text-gray-700">
              <span className="font-medium">Stay updated!</span> Subscribe to our newsletter.
            </label>
          </div>

          <div>
            <Button type="submit" className="w-full">
              <div className="flex justify-center items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Send Feedback</span>
              </div>
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
