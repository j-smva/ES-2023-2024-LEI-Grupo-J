package ProjetoEs.ProjetoEs1;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for simple App.
 */
public class AppTest extends TestCase {
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AppTest( String testName ) {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
    	TestSuite fileTests = new TestSuite( FileTest.class );
    	fileTests.addTestSuite( CSVReading.class );
    	fileTests.addTestSuite( FileCreator.class );
        return fileTests;
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp() {
        assertTrue( true );
    }
}
