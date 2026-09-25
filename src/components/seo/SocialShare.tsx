import { Button } from '@/components/ui/button';
import { SITE } from '@/constants/site';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Facebook, Instagram, Link2, MessageCircle, Share2, Twitter } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface SocialShareProps {
  title?: string;
  description?: string;
  url?: string;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  title = "Mix Food - Ẩm Thực Thái Đà Nẵng",
  description = "Nhà hàng ẩm thực Thái chính thống tại Đà Nẵng. Thưởng thức các món ăn Thái Lan đặc sắc.",
  url = typeof window !== 'undefined' ? window.location.href : SITE.url,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}&hashtags=ẩmThựcThái,ĐàNẵng,MixFood`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'Zalo',
      icon: MessageCircle,
      url: `https://zalo.me/share?url=${shareUrl}&title=${shareTitle}&description=${shareDescription}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: `https://www.instagram.com/`,
      color: 'bg-primary-gradient hover:from-purple-600 hover:to-pink-600'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Đã sao chép đường dẫn!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Không thể sao chép đường dẫn');
    }
  };

  const handleShare = (platform: string, shareUrl: string) => {
    if (platform === 'Instagram') {
      toast.info('Mở Instagram và chia sẻ hình ảnh về Mix Food!');
      return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Chia sẻ trên mạng xã hội</h4>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 text-white ${social.color} border-0`}
                    onClick={() => handleShare(social.name, social.url)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{social.name}</span>
                  </Button>
                );
              })}
            </div>
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2"
                onClick={copyToClipboard}
              >
                <Link2 className="h-4 w-4" />
                {copied ? 'Đã sao chép!' : 'Sao chép link'}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SocialShare;
