import { Container, Section } from "@/components/layout";
import { Card, CardContent } from "@/components/ui";
import { client } from "@/lib/sanity/client";
import { resolveImageUrl } from "@/lib/sanity/image";
import type { TeamMember } from "@/lib/sanity/types";

interface TeamSectionBlockProps {
  heading?: string;
  subheading?: string;
  displayType?: "all" | "selected";
  teamMembers?: TeamMember[];
  layout?: "grid" | "list";
  showBio?: boolean;
}

export async function TeamSectionBlock({
  heading,
  subheading,
  displayType = "all",
  teamMembers: selectedMembers,
  layout = "grid",
  showBio = true,
}: TeamSectionBlockProps) {
  let members: TeamMember[];

  if (displayType === "selected" && selectedMembers?.length) {
    members = selectedMembers;
  } else {
    members = await client.fetch<TeamMember[]>(
      `*[_type == "teamMember"] | order(name asc) { _id, name, role, bio, email, photo { asset, public_id, format, width, height, version, gravity, alt } }`
    );
  }

  if (!members.length) return null;

  return (
    <Section spacing="lg">
      <Container>
        {heading && (
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-4">
              {heading}
            </h2>
            {subheading && (
              <p className="text-stone-600 max-w-2xl mx-auto">{subheading}</p>
            )}
          </div>
        )}

        {layout === "list" ? (
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {members.map((member) => (
              <Card key={member._id}>
                <CardContent className="p-5 flex items-center gap-4">
                  {resolveImageUrl(member.photo as Record<string, unknown>) ? (
                    <img
                      src={resolveImageUrl(member.photo as Record<string, unknown>, { width: 208, height: 208, fit: "fill" })!}
                      alt={member.name}
                      className="size-52 rounded-b-sm object-cover shrink-0"
                    />
                  ) : (
                    <div className="size-52 rounded-b-sm bg-forest-100 flex items-center justify-center text-forest-700 font-bold text-lg shrink-0">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-stone-800">{member.name}</p>
                    {member.role && (
                      <p className="text-sm text-forest-600">{member.role}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card key={member._id}>
                <CardContent className="p-6 text-center">
                  {resolveImageUrl(member.photo as Record<string, unknown>) ? (
                    <img
                      src={resolveImageUrl(member.photo as Record<string, unknown>, { width: 208, height: 208, fit: "fill" })!}
                      alt={member.name}
                      className="size-52 rounded-b-md object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="size-16 rounded-b-md bg-forest-100 flex items-center justify-center text-forest-700 font-bold text-2xl mx-auto mb-4">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-semibold text-stone-800 text-lg">
                    {member.name}
                  </p>
                  {member.role && (
                    <p className="text-sm text-forest-600 mt-1">{member.role}</p>
                  )}
                  {showBio && member.bio && (
                    <p className="text-stone-600 text-sm mt-3 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
