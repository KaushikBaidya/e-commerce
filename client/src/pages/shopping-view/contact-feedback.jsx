import {
  Camera,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Star,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

export default function ContactFeedback() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('general');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide your feedback';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Feedback must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      newsletter: false,
    });
    setErrors({});
    setRating(0);
    setUploadedImages([]);
    setFeedbackType('general');
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              url: e.target.result,
              name: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const feedbackData = {
      ...formData,
      rating,
      feedbackType,
      images: uploadedImages,
      timestamp: new Date().toISOString(),
    };

    console.log('Feedback submitted:', feedbackData);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      resetForm();
    }, 3000);
  };

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageCircle },
    { value: 'auction', label: 'Auction Experience', icon: FileText },
    { value: 'artist', label: 'Artist Support', icon: Camera },
    { value: 'technical', label: 'Technical Issue', icon: Upload },
  ];

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
