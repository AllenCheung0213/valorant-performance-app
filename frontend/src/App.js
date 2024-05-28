import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar,
    Box,
    Container,
    CssBaseline,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Toolbar,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Avatar
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function App() {
    const [content, setContent] = useState(null);
    const [locale, setLocale] = useState('en-US');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [popularity, setPopularity] = useState(null);

    useEffect(() => {
        fetchContent();
        fetchPopularity();
    }, [locale]);

    const fetchContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8000/content', {
                params: { locale }
            });
            setContent(response.data);
        } catch (error) {
            console.error('Error fetching content:', error);
            setError('Error fetching content. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPopularity = async () => {
        try {
            const response = await axios.get('http://localhost:8000/popularity');
            setPopularity(response.data);
        } catch (error) {
            console.error('Error fetching popularity data:', error);
        }
    };

    const renderContentGrid = (items, title) => (
        <>
            <Typography variant="h5" component="div" my={2}>
                {title}
            </Typography>
            <Grid container spacing={2}>
                {items.map((item) => {
                    console.log(`${title} - ${item.name}: ${item.assetPath}`);
                    return (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                            <Card>
                                <CardContent>
                                    <Avatar
                                        variant="square"
                                        src={item.assetPath || item.icon}
                                        alt={item.name}
                                        sx={{ width: '100%', height: 'auto' }}
                                    />
                                    <Typography variant="body2" component="div">
                                        {item.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );

    const agentChartData = popularity ? {
        labels: popularity.agents.map(agent => agent.name),
        datasets: [
            {
                label: 'Popularity (%)',
                data: popularity.agents.map(agent => agent.popularity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }
        ]
    } : null;

    const mapChartData = popularity ? {
        labels: popularity.maps.map(map => map.name),
        datasets: [
            {
                label: 'Popularity (%)',
                data: popularity.maps.map(map => map.popularity),
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
            }
        ]
    } : null;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Valorant Content Viewer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Box my={4}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="locale-select-label">Locale</InputLabel>
                        <Select
                            labelId="locale-select-label"
                            value={locale}
                            onChange={(e) => setLocale(e.target.value)}
                            label="Locale"
                        >
                            <MenuItem value="en-US">English (US)</MenuItem>
                            <MenuItem value="de-DE">German</MenuItem>
                            <MenuItem value="es-ES">Spanish (Spain)</MenuItem>
                            <MenuItem value="fr-FR">French</MenuItem>
                            {/* Add other locales as needed */}
                        </Select>
                    </FormControl>

                    {error && <Alert severity="error">{error}</Alert>}
                    {loading ? (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {content && (
                                <>
                                    {renderContentGrid(content.characters, 'Characters')}
                                    {renderContentGrid(content.maps, 'Maps')}
                                    {renderContentGrid(content.chromas, 'Chromas')}
                                    {renderContentGrid(content.skins, 'Skins')}
                                    {renderContentGrid(content.skinLevels, 'Skin Levels')}
                                    {renderContentGrid(content.equips, 'Equips')}
                                    {renderContentGrid(content.gameModes, 'Game Modes')}
                                    {renderContentGrid(content.sprays, 'Sprays')}
                                    {renderContentGrid(content.sprayLevels, 'Spray Levels')}
                                    {renderContentGrid(content.charms, 'Charms')}
                                    {renderContentGrid(content.charmLevels, 'Charm Levels')}
                                    {renderContentGrid(content.playerCards, 'Player Cards')}
                                    {renderContentGrid(content.playerTitles, 'Player Titles')}
                                </>
                            )}

                            {popularity && (
                                <Card variant="outlined" sx={{ my: 4 }}>
                                    <CardHeader title="Popularity" />
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Agents
                                        </Typography>
                                        <Bar data={agentChartData} />
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" component="div" my={2}>
                                            Maps
                                        </Typography>
                                        <Bar data={mapChartData} />
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
}

export default App;
