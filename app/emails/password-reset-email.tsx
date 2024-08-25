import * as React from 'react';

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  // Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { APP_NAME, HOST_NAME } from '~/lib/constants';

export function ResetPasswordEmail({ token }: { token: string }) {
  return (
    <Html>
      <Head />
      <Preview>SchoolForm password reset</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="mx-auto my-auto bg-white font-sans">
            <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
              {/* <Section className="mt-[32px]">
                <Img
                  src={`${HOST_NAME}/group.jpeg`}
                  width="160"
                  height="48"
                  alt="StarterKit"
                  className="mx-auto my-0"
                />
              </Section> */}

              <Section className="mb-[32px] mt-[32px] text-center">
                <Text className="mb-8 text-[14px] font-medium leading-[24px] text-black">
                  Click the following link to reset your password
                </Text>

                <Text className="text-[14px] font-medium leading-[24px] text-black">
                  <Link
                    href={`${HOST_NAME}/reset-password?token=${token}`}
                    target="_blank"
                    className="text-[#2754C5] underline"
                  >
                    Reset password
                  </Link>
                </Text>
              </Section>

              <Text className="text-[14px] font-medium leading-[24px] text-black">
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>

              <Text className="text-[14px] font-medium leading-[24px] text-black">
                To keep your account secure, please don&apos;t forward this
                email to anyone.
              </Text>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

              <Text className="flex items-center justify-center text-[12px] leading-[24px] text-[#666666]">
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
}
