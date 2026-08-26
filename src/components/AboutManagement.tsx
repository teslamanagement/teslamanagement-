import React from 'react';
import { Building2, Briefcase, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { AuthorizationInfo } from '../types';

interface AboutManagementProps {
  authInfo?: AuthorizationInfo;
}

export const AboutManagement: React.FC<AboutManagementProps> = ({
  authInfo,
}) => {
  const representativeName = authInfo?.representativeName || 'Client Services & Fleet Allocation Desk';
  const authorizedTitle = authInfo?.authorizedTitle || 'Client Vehicle Representative & Allocation Coordinator';
  const officialEmail = authInfo?.officialEmail || 'teslasemi60@gmail.com';
  const officialPhone = authInfo?.officialPhone || 'Unavailable at this moment';
  const officeLocation = authInfo?.officeLocation || 'Tesla Management Operations & International Client Support Center, 1 Tesla Road, Austin, TX 78725';

  const responsibilities = [
    'Client vehicle purchase request processing and configuration coordination',
    'Application and confirmation of management promotional allocation pricing',
    'Cross-border delivery, logistics, and documentation review assistance',
    'Dedicated corporate fleet and individual customer order support',
    'Purchase guidance, client payment security, and order tracking',
  ];

  return (
    <section id="about" className="py-20 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block mb-2">
            Operations & Scope
          </span>
          <h2 className="text-5xl font-extrabold text-neutral-900 tracking-tight">
            About Management
          </h2>
          <p className="text-base text-neutral-600 mt-3 leading-relaxed">
            Dedicated client assistance team coordinating vehicle specifications, promotional pricing inquiries, and order allocations.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Desk Information Box */}
          <div className="col-span-5 p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  Management Desk
                </span>
                <h3 className="text-lg font-bold text-neutral-900">
                  {representativeName}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200/80 space-y-3 text-xs">
              <div>
                <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Desk Function</span>
                <span className="text-neutral-900 font-semibold text-sm">{authorizedTitle}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 space-y-2">
                <div className="flex items-center space-x-2 text-neutral-700">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="font-mono text-xs">{officialEmail}</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-700">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="font-mono text-xs">{officialPhone}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-xs text-neutral-600 flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{officeLocation}</span>
            </div>
          </div>

          {/* Scope & Responsibilities */}
          <div className="col-span-7 space-y-6">
            <div className="p-8 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-6 shadow-2xs">
              <div>
                <h4 className="text-lg font-bold text-neutral-900 mb-2 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-red-600" />
                  <span>Key Responsibilities</span>
                </h4>
                <p className="text-sm text-neutral-600">
                  Management coordinates client inquiries and purchasing workflows according to high operational standards:
                </p>
              </div>

              <div className="space-y-3">
                {responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-800 font-medium">{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
