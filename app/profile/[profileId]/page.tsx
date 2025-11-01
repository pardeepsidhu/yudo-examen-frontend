'use client';

import React from 'react';

import { useParams } from 'next/navigation';
import ProfilePage from '../../../components/profile/profile';

export default function Page() {

  const params = useParams();
  const profileId = params?.profileId as string;


  return <ProfilePage profileId={profileId} />
  
}