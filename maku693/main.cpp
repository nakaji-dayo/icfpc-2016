#include <iostream>
#include <fstream>
#include <string>
#include <vector>

#include <boost/algorithm/string/split.hpp>
#include <boost/algorithm/string/classification.hpp>
#include <boost/multiprecision/cpp_int.hpp>

struct Fraction {
    boost::multiprecision::cpp_int n, m;

    Fraction() = default;

    Fraction(boost::multiprecision::cpp_int _n, boost::multiprecision::cpp_int _m)
        :n(_n)
        ,m(_m) {}

    Fraction(std::string _n, std::string _m)
        :n(_n)
        ,m(_m) {}

    Fraction operator +(const Fraction& rhs)
    {
        return { n * rhs.m + rhs.n * m, m * rhs.m };
    }

    Fraction operator -(const Fraction& rhs)
    {
        return { n * rhs.m - rhs.n * m, m * rhs.m };
    }

    Fraction operator *(const Fraction& rhs)
    {
        return { n * rhs.n, m * rhs.m };
    }

    Fraction operator /(const Fraction& rhs)
    {
        return { n * rhs.m, m * rhs.n };
    }
};

struct Point {
    Fraction x;
    Fraction y;

    Point() = default;

    Point(Fraction _x, Fraction _y)
        :x(_x)
        ,y(_y) {}

    Point operator +(Point& rhs)
    {
        return { x + rhs.x, y + rhs.y };
    }

    Point operator -(Point& rhs)
    {
        return { x - rhs.x, y - rhs.y };
    }

    Point operator *(Fraction& rhs)
    {
        return { x * rhs, y * rhs };
    }

    Point operator /(Fraction& rhs) 
    {
        return { x / rhs, y / rhs };
    }
};

struct Polygon {
    std::vector<Point> vertices;
};

struct Problem {
    std::vector<Polygon> polygons;
    std::vector<Polygon> lineSegments;

    std::string str()
    {
        std::stringstream stream;
        stream << "Number of polygons: " << polygons.size() << "\n";
        for (auto e : polygons) {
            stream << "Number of vertices for polygon: " << e.vertices.size() << "\n";
        }
        stream << "Number of line segments: " << lineSegments.size() << "\n";

        return stream.str();
    }
};

struct Solution { };

std::vector<std::string> parseLineSegment(const std::string content)
{
    std::vector<std::string> parsedLineSegment;
    return parsedLineSegment;
}

std::vector<std::string> parsePoint(const std::string content)
{
    std::vector<std::string> parsedPoint;
    return parsedPoint;
}

std::shared_ptr<Fraction> parseFraction(const std::string content)
{
    std::shared_ptr<Fraction> fraction(new Fraction());
    return fraction;
}

std::shared_ptr<Problem> parse(const std::vector<std::string> contents) {
    std::shared_ptr<Problem> problem(new Problem());

    int currentIndex = 0;
    const int POLYGONS_COUNT = std::stoi(contents[currentIndex]);

    for (int i = 0; i < POLYGONS_COUNT; i++) {
        std::shared_ptr<Polygon> polygon(new Polygon());

        currentIndex++;
        const int VERTICES_COUNT = std::stoi(contents[currentIndex]);

        for (int j = 0; j < VERTICES_COUNT; j++) {
            currentIndex++;

            auto parsedLine = parsePoint(contents[currentIndex]);

            Fraction x;
            Fraction y;

            for (int k = 0; k < parsedLine.size(); k++) {
                auto fractionStr = parsedLine[k];
                auto fraction = parseFraction(fractionStr);
                switch(k) {
                    case 1:
                        x = *fraction;
                        break;
                    case 2:
                        y = *fraction;
                        break;
                    default:
                        break;
                }
            }

            std::shared_ptr<Point> vertex(new Point(x, y));
            polygon->vertices.push_back(*vertex);
        }

        problem->polygons.push_back(*polygon);
    }

    currentIndex++;
    int LINE_SEGMENTS_COUNT = std::stoi(contents[currentIndex]);

    for (int i = 0; i < LINE_SEGMENTS_COUNT; i++) {
        currentIndex++;
        std::cout << "v:" << contents[currentIndex];

        std::shared_ptr<Polygon> lineSegment(new Polygon());

        Fraction ax;
        Fraction ay;
        std::shared_ptr<Point> vertexA(new Point(ax, ay));
        lineSegment->vertices.push_back(*vertexA);

        Fraction bx;
        Fraction by;
        std::shared_ptr<Point> vertexB(new Point(bx, by));
        lineSegment->vertices.push_back(*vertexB);

        problem->lineSegments.push_back(*lineSegment);
    }

    return problem;
}

std::shared_ptr<Problem> fold(std::shared_ptr<Problem> prevProblem)
{
    std::shared_ptr<Problem> nextProblem(new Problem());
    // TODO:
    return nextProblem;
}

std::shared_ptr<Solution> solve(std::shared_ptr<Problem> problem)
{
    std::shared_ptr<Solution> solution(new Solution);
    // TODO:
    return solution;
}

int main(int argc, char* argv[])
{
    const std::string fileName = argv[1];
    std::ifstream inFile(fileName, std::ios::in);

    std::string lineBuffer;
    std::vector<std::string> contents;

    // Read file and generate array of lines to parse
    while(std::getline(inFile, lineBuffer))
    {
        contents.push_back(lineBuffer + "\n");
    }

    auto problem = parse(contents);
    std::cout << problem->str();

    auto solution = solve(problem);

    return 0;
}
