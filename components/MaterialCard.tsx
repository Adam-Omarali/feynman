import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";

const imageList = [
  "https://www.notion.so/images/page-cover/nasa_space_shuttle_columbia.jpg",
  "https://www.notion.so/images/page-cover/nasa_eagle_in_lunar_orbit.jpg",
  "https://www.notion.so/images/page-cover/nasa_wrights_first_flight.jpg",
  "https://www.notion.so/images/page-cover/nasa_orion_nebula.jpg",
  "https://www.notion.so/images/page-cover/nasa_space_shuttle_columbia_and_sunrise.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_1.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_11.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_sekka_1.jpg",
  "https://www.notion.so/images/page-cover/gradients_5.png",
  "https://www.notion.so/images/page-cover/gradients_11.jpg",
  "https://www.notion.so/images/page-cover/gradients_8.png",
  "https://www.notion.so/images/page-cover/gradients_10.jpg",
];

export function MaterialCard() {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Card.Section>
        <Image
          src={imageList[Math.floor(Math.random() * imageList.length)]}
          height={160}
          alt="Image"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Norway Fjord Adventures</Text>
        <Badge color="pink" variant="light">
          On Sale
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes
        with tours and activities on and around the fjords of Norway
      </Text>

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>
  );
}
