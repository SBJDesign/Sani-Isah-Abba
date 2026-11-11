import { ArrowUpRight, Award, BookOpenCheck, FileText, GraduationCap, Lightbulb, MapPin, PenLine, Presentation, Users } from 'lucide-react'
import { PageHeader } from '../components/SiteLayout'
import { interestIcon } from '../components/icons'
import { useProfile } from '../lib/store'

function sectionIcon(title: string) {
  const t = title.toLowerCase()
  if (/award|honou/.test(t)) return Award
  if (/patent/.test(t)) return Lightbulb
  if (/member|committee|grant/.test(t)) return Users
  if (/editor|review/.test(t)) return PenLine
  if (/teach|supervis/.test(t)) return Presentation
  return BookOpenCheck
}

export default function About() {
  const { profile } = useProfile()
  const parts = profile.name.split(/\s+/).filter(Boolean)
  const initials = (parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
  return (
    <>
      <PageHeader title="About" intro={profile.title} />
      <div className="page grid gap-12 lg:grid-cols-[1fr_21rem]">
        <div className="max-w-prose space-y-5 font-serif text-[1.125rem] leading-[1.75] text-ink-soft first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-observed">
          {profile.bio.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <aside className="relative z-10 lg:-mt-36">
          <div className="overflow-hidden rounded-2xl border border-rule bg-white shadow-[0_20px_50px_-28px_rgba(18,50,74,0.35)]">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt={`Portrait of ${profile.name}`} className="aspect-[4/5] w-full object-cover" />
            ) : (
              <div className="flex aspect-[5/4] items-center justify-center bg-gradient-to-br from-observed to-ink text-6xl font-medium text-white/90">{initials}</div>
            )}
            <div className="space-y-4 p-6 text-[0.95rem]">
              <div>
                <p className="font-medium">{profile.honorific} {profile.name}</p>
                <p className="mt-1 text-ink-soft">{profile.affiliation}</p>
              </div>
              <p className="flex items-start gap-2 text-sediment"><MapPin size={16} className="mt-1 shrink-0" aria-hidden /> {profile.location}</p>
              {profile.cv_url && (
                <a href={profile.cv_url} className="btn-primary w-full" target="_blank" rel="noreferrer"><FileText size={16} aria-hidden /> Download full CV</a>
              )}
            </div>
          </div>
        </aside>
      </div>

      <section className="page mt-20">
        <h2 className="text-2xl font-medium tracking-tight">Research interests</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {profile.interests.map((x) => {
            const Icon = interestIcon(x)
            return (
              <li key={x} className="inline-flex items-center gap-2 rounded-full border border-rule bg-white py-2 pl-3 pr-4 text-[0.95rem]">
                <Icon size={17} className="text-observed" aria-hidden /> {x}
              </li>
            )
          })}
        </ul>
      </section>

      <div className="page mt-20 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-rule bg-white p-7">
          <h2 className="text-xl font-medium">Appointments</h2>
          <ol className="relative mt-6 space-y-6 border-l-2 border-rule pl-6">
            {profile.appointments.map((a, i) => (
              <li key={i} className="relative">
                <span aria-hidden className={`absolute -left-[1.95rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ${i === 0 ? 'bg-observed' : 'bg-rule'}`} />
                <div className="text-sm text-sediment">{a.period}</div>
                <div className="font-medium">{a.role}</div>
                <div className="text-ink-soft">{a.institution}</div>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-2xl border border-rule bg-white p-7">
          <h2 className="text-xl font-medium">Education</h2>
          <ol className="mt-6 space-y-5">
            {profile.education.map((e, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-predicted/15 text-[#8A5A0B]"><GraduationCap size={19} aria-hidden /></span>
                <div>
                  <div className="font-medium">{e.degree}{e.year ? `, ${e.year}` : ''}</div>
                  <div className="text-ink-soft">{e.institution}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {!!profile.sections?.length && (
        <div className="page mt-20 grid gap-8 md:grid-cols-2">
          {profile.sections.filter((x) => x.title && x.items.length).map((sec) => {
            const Icon = sectionIcon(sec.title)
            return (
              <section key={sec.title} className="rounded-2xl border border-rule bg-white p-7">
                <h2 className="flex items-center gap-3 text-xl font-medium">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-observed/10 text-observed"><Icon size={19} aria-hidden /></span>
                  {sec.title}
                </h2>
                <ul className="mt-5 space-y-3 text-[0.97rem] text-ink-soft">
                  {sec.items.map((it, i) => (
                    <li key={i} className="flex gap-3"><span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-predicted" />{it}</li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      <section className="page mt-20">
        <h2 className="text-2xl font-medium tracking-tight">Research profiles</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {profile.links.map((l) => (
            <li key={l.label}>
              <a href={l.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-xl border border-rule bg-white px-5 py-4 font-medium hover:border-observed/50">
                {l.label} <ArrowUpRight size={17} className="text-sediment group-hover:text-observed" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
