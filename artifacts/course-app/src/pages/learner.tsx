import { useMemo } from 'react';
import { BookOpen, ChevronLeft, LibraryBig, MessagesSquare } from 'lucide-react';
import { Link } from 'wouter';
import { AppShell, EmptyState, LoadingState, PageHeading } from '@/components/app-shell';
import { useLearnerSession } from '@/lib/learner-session-context';
import { useLearnerCourses } from '@/lib/course-api';
import type { Course, CourseContentItem } from '@/lib/course-types';
import { GroupChatPage } from '@/pages/group-chat';
import { LearnerContentViewerPage } from '@/pages/course-player';

function flattenItems(course: Course): CourseContentItem[] {
  return [
    ...course.items,
    ...course.levels.flatMap((level) => [
      ...level.items,
      ...level.sections.flatMap((section) => section.items),
    ]),
  ];
}

export function LearnerHomePage() {
  const { learner } = useLearnerSession();
  const coursesQuery = useLearnerCourses();
  const courses = useMemo(
    () => [...(coursesQuery.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [coursesQuery.data],
  );
  const firstCourse = courses[0];
  const allItems = firstCourse ? flattenItems(firstCourse) : [];
  const completed = allItems.filter((item) => item.progress?.completed).length;
  const percent = allItems.length ? Math.round((completed / allItems.length) * 100) : 0;

  return (
    <AppShell title="رحلتي التعليمية" audience="learner">
      <PageHeading
        eyebrow="أهلًا بعودتك"
        title={learner ? `مرحبًا، ${learner.name}` : 'مساحة المتعلّم'}
        subtitle="تم تسجيل الدخول باستخدام رمز الوصول الخاص بك."
      />
      <section className="panel learner-welcome">
        <div className="dialog-icon">
          <BookOpen size={22} aria-hidden="true" />
        </div>
        <div>
          <div className="eyebrow">الحساب المرتبط</div>
          <div className="learner-account-name" data-testid="text-learner-name">
            {learner?.name}
          </div>
          <div className="person-email ltr" data-testid="text-learner-email">
            {learner?.email}
          </div>
        </div>
      </section>
      {coursesQuery.isLoading ? (
        <section className="panel learner-home-status"><LoadingState label="جارٍ تجهيز مسارك التعليمي…" /></section>
      ) : coursesQuery.isError ? (
        <section className="panel learner-empty-panel">
          <EmptyState title="تعذّر تحميل دورتك" description="تحقق من اتصالك ثم حاول فتح المسار مرة أخرى." icon={LibraryBig} />
          <div className="empty-state-action"><button type="button" className="button-soft" onClick={() => void coursesQuery.refetch()}>إعادة المحاولة</button></div>
        </section>
      ) : firstCourse ? (
        <>
          <section className="learner-home-course">
            <div className="learner-home-course-top">
              <div>
                <div className="eyebrow">خطوتك التالية</div>
                <h2>{firstCourse.name}</h2>
                <p>{completed ? `أكملت ${new Intl.NumberFormat('ar').format(completed)} من ${new Intl.NumberFormat('ar').format(allItems.length)} مواد.` : 'ابدأ من أول درس، وتقدّم بالوتيرة التي تناسبك.'}</p>
              </div>
              <div className="learner-home-progress"><strong>{new Intl.NumberFormat('ar').format(percent)}٪</strong><span>مكتمل</span></div>
            </div>
            <div className="course-progress-track"><span style={{ width: `${percent}%` }} /></div>
            <Link className="button-primary learner-home-continue" href={`/learn/course/${encodeURIComponent(firstCourse.id)}`}>
              <BookOpen size={17} aria-hidden="true" /> متابعة التعلّم <ChevronLeft size={16} aria-hidden="true" />
            </Link>
          </section>
          {courses.length > 1 && (
            <section className="learner-home-extra">
              <h2>مساراتك الأخرى</h2>
              {courses.slice(1).map((course) => <Link key={course.id} className="learner-home-course-link" href={`/learn/course/${encodeURIComponent(course.id)}`}><span>{course.name}</span><ChevronLeft size={17} /></Link>)}
            </section>
          )}
        </>
      ) : (
        <section className="panel learner-empty-panel">
          <EmptyState title="لا توجد دروس متاحة بعد" description="تم تجهيز دخولك. ستظهر الدورة ومحتواها هنا عند إضافتهما." icon={LibraryBig} />
        </section>
      )}
      <Link className="learner-home-community" href="/learn/community">
        <span className="learner-home-community-icon"><MessagesSquare size={20} /></span>
        <span><strong>مساحة المجموعة</strong><small>تابع المحادثة مع المتعلمين</small></span>
        <ChevronLeft size={17} />
      </Link>
    </AppShell>
  );
}

export function LearnerCommunityPage() {
  return <GroupChatPage audience="learner" />;
}

export function LearnerContentPage() {
  return <LearnerContentViewerPage />;
}
