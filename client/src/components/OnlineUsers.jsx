import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent, 
  Typography,
  Box,
  Avatar,
  Badge,
  Chip,
  Tooltip, 
  Divider,
} from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";
 
function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("");
}
function colorFromName(name = "") { 
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h} 70% 85%)`;
}

export default function OnlineUsers({ users = [], me,  }) { 
  const normalize = (u) =>
    typeof u === "string"
      ? { name: u, status: "online" }
      : { status: "online", ...u };

  const [query] = useState("");

  const { list, total } = useMemo(() => {
    const mapped = users.map(normalize); 
    mapped.sort((a, b) => {
      const aIsMe = me && a.name?.toLowerCase() === me?.toLowerCase();
      const bIsMe = me && b.name?.toLowerCase() === me?.toLowerCase();
      if (aIsMe && !bIsMe) return -1;
      if (!aIsMe && bIsMe) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    const filtered = mapped.filter((u) =>
      (u.name || "").toLowerCase().includes(query.toLowerCase())
    );
    return { list: filtered, total: mapped.length };
  }, [users, me, query]);

  return (
    <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <CardHeader
        titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
        title={`Online Users (${total})`}
         
      />
      <CardContent sx={{ pt: 0 }}>

        <Divider sx={{ mb: 2 }} />

        {list.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              color: "text.secondary",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2">No users match your search.</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 1.5,
              maxHeight: 280,
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {list.map((u, idx) => {
              const name = u.name || "Unknown";
              const isMe = me && name.toLowerCase() === me?.toLowerCase();
              const status = u.status || "online";  
              const statusColor =
                {
                  online: "#22c55e",
                  away: "#f59e0b",
                  busy: "#ef4444",
                  offline: "#94a3b8",
                }[status] || "#22c55e";

              return (
                <Tooltip
                  key={`${name}-${idx}`}
                  arrow
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: statusColor,
                        }}
                      />
                      <Typography variant="caption">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Typography>
                    </Box>
                  }
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      transition: "transform .12s ease, box-shadow .12s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                        borderColor: "transparent",
                      },
                      background: isMe
                        ? "linear-gradient(0deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02))"
                        : "transparent",
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: statusColor,
                            border: "2px solid",
                            borderColor: "background.paper",
                          }}
                        />
                      }
                    >
                      <Avatar
                        alt={name}
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: 14,
                          fontWeight: 700,
                          bgcolor: colorFromName(name),
                          color: "text.primary",
                        }}
                      >
                        {getInitials(name)}
                      </Avatar>
                    </Badge>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontWeight: 600 }}
                          title={name}
                        >
                          {name}
                        </Typography>
                        {isMe && (
                          <Chip
                            size="small"
                            label="You"
                            color="primary"
                            variant="outlined"
                            sx={{
                              height: 20,
                              "& .MuiChip-label": { px: 0.75, fontSize: 11 },
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        title={u.title || u.role || ""}
                      >
                        {u.title || u.role || "Active now"}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
