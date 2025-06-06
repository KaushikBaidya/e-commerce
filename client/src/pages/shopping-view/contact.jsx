import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addUserMessage } from '@/store/shop/feedback-slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, MapPin, MessageCircle, Phone, Send, Star, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .required('Please provide your feedback'),
});

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const feedbackData = {
      ...data,
    };

    try {
      const response = await dispatch(addUserMessage(feedbackData));
      if (response?.payload?.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
      }, 3000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been successfully submitted. We appreciate you taking the time to help
            us improve ArtVault.
          </p>
          <div className="animate-pulse text-purple-600 font-medium">Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We'd Love Your <span className="text-purple-600">Feedback</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us improve ArtVault by sharing your thoughts, experiences, and suggestions. Your
            input shapes the future of our art auction platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <p className="text-gray-600">feedback@artvault.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Visit Us</h3>
                    <p className="text-gray-600">
                      123 Art District Lane
                      <br />
                      New York, NY 10001
                    </p>
                    <p className="text-sm text-gray-500">By appointment only</p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Help</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                    How to bid on auctions?
                  </a>
                  <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                    Submit artwork for sale
                  </a>
                  <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                    Authentication process
                  </a>
                  <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                    Payment & shipping
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold pt-6">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input {...register('name')} className="input-design" placeholder="Your name" />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      className="input-design"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject *
                    </label>
                    <input
                      {...register('subject')}
                      className="input-design"
                      placeholder="Subject of your message"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Message *
                    </label>
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
                  <div>
                    <Button type="submit" className="w-full">
                      <div className="flex justify-center items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Send Feedback</span>
                      </div>
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
          {/* Feedback Form */}
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Quick Response</h3>
            <p className="text-gray-600 text-sm">We respond to all feedback within 24 hours</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Your Voice Matters</h3>
            <p className="text-gray-600 text-sm">Every suggestion helps us improve ArtVault</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Visual Feedback</h3>
            <p className="text-gray-600 text-sm">Upload screenshots to help us understand issues</p>
          </div>
        </div>
      </div>
    </div>
  );
}
