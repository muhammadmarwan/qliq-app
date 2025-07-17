import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Card, Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Import your API function
import { getUserMLMDetails } from "../api/api"; // ✅ adjust path if needed

type User = {
  id: string;
  name: string;
  email?: string;
  level: number;
  commissionBalance?: number;
  downlines: User[];
};

const levelStyles = [
  { backgroundColor: "#d0e2ff", textColor: "#003a75" }, // level 0 blue
  { backgroundColor: "#d0ffd6", textColor: "#004d20" }, // level 1 green
  { backgroundColor: "#fff2cc", textColor: "#7a5700" }, // level 2 yellow
  { backgroundColor: "#ffd6e8", textColor: "#660033" }, // level 3 pink
  { backgroundColor: "#e5d7ff", textColor: "#3d0072" }, // level 4 purple
];

function UserNode({ user }: { user: User }) {
  const style = levelStyles[user.level] || levelStyles[levelStyles.length - 1];

  return (
    <View style={[styles.nodeContainer, { marginLeft: user.level * 16 }]}>
      <Card style={[styles.card, { backgroundColor: style.backgroundColor }]}>
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color={style.textColor}
            style={{ marginRight: 6 }}
          />
          <View>
            <Text style={[styles.nameText, { color: style.textColor }]}>
              {user.name}
            </Text>
            {user.level !== 0 && (
              <Text style={[styles.levelText, { color: style.textColor }]}>
                Level {user.level}
              </Text>
            )}
            {user.email && (
              <Text style={[styles.emailText, { color: style.textColor }]}>
                {user.email}
              </Text>
            )}
            {user.commissionBalance != null && user.commissionBalance !== 0 && (
              <Text style={[styles.commissionText, { color: style.textColor }]}>
                Commission: ${user.commissionBalance}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {user.downlines.length > 0 &&
        user.downlines.map((downline: any) => (
          <UserNode key={downline.id || downline._id} user={downline} />
        ))}
    </View>
  );
}

export default function MLMScreen() {
  const [treeData, setTreeData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const data = await getUserMLMDetails();

        // Normalize the _id to id for consistency
        const normalizeTree = (node: any): User => ({
          id: node._id,
          name: node.name,
          email: node.email,
          level: node.level,
          commissionBalance: node.commissionBalance,
          downlines: (node.downlines || []).map(normalizeTree),
        });

        setTreeData(normalizeTree(data));
      } catch (error) {
        console.error("Failed to fetch MLM tree:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>MLM User Tree</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : treeData ? (
        <UserNode user={treeData} />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No MLM data available.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingVertical: 40,
    paddingHorizontal: 12,
    backgroundColor: "#f7f7f7",
  },
  heading: {
    fontSize: 28,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#030303ff",
  },
  nodeContainer: {
    marginVertical: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#888",
    paddingLeft: 8,
  },
  card: {
    elevation: 3,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  nameText: {
    fontWeight: "700",
    fontSize: 14,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emailText: {
    fontSize: 10,
  },
  commissionText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "600",
  },
});
